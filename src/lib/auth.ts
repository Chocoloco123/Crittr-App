import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      } : undefined,
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@crittr.app',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account: _account, profile: _profile, email: _email, credentials: _credentials }) {
      // Sync user data with backend after successful sign in
      if (user.email) {
        try {
          const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
          await fetch(`${backendUrl}/users/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name || user.email.split('@')[0]
            })
          })
          console.log(`✅ User ${user.email} synced with backend`)
        } catch (error) {
          console.error('Backend sync error:', error)
          // Don't fail the authentication if backend sync fails
        }
      }
      return true
    },
    async session({ session, user }) {
      // Add user ID to session
      if (session.user && user) {
        (session.user as Record<string, unknown>).id = user.id
        // Keep the full email as the name if no name is set
        if (!session.user.name && session.user.email) {
          session.user.name = session.user.email
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

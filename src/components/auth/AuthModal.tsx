'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import './AuthModal.scss'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Google sign in error:', error)
      setIsGoogleLoading(false)
    }
  }

  if (!mounted || !isOpen) return null

  return (
    <AnimatePresence>
      <div className="auth-modal-container">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="auth-modal-backdrop"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="auth-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="auth-modal-close-button"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="auth-modal-header">
            <div className="auth-modal-logo">
              <Image 
                src="/images/icons/pawsIcon.png" 
                alt="Crittr Logo" 
                width={48} 
                height={32}
                className="w-12 h-8 object-contain"
                priority
              />
              <span className="auth-modal-logo-text">Crittr</span>
            </div>
            <h2 className="auth-modal-title">
              Welcome!
            </h2>
            <p className="auth-modal-description">
              Sign in with Google to start tracking your pet&apos;s health journey
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="auth-modal-actions">
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="auth-modal-google-button"
            >
              {isGoogleLoading ? (
                <Loader2 className="auth-modal-google-icon animate-spin" />
              ) : (
                <svg className="auth-modal-google-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="auth-modal-footer">
            <p className="auth-modal-footer-text">
              By signing in, you agree to our{' '}
              <a href="/terms" className="auth-modal-footer-link">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="auth-modal-footer-link">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Nunito_Sans, Inter, Roboto } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import StructuredData from "@/components/seo/StructuredData";
import Footer from "@/components/layout/Footer/Footer";
import FloatingChatbot from "@/components/ai/FloatingChatbot";
import { PerformanceMonitor } from "../components/ui/PerformanceMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://crittr.app' : 'http://localhost:3000'),
  title: {
    default: "Crittr - The Journaling & Tracking App for Pet Parents",
    template: "%s | Crittr"
  },
  description: "Crittr is the journaling and tracking app for pet parents. Track your pet's health, daily activities, feeding schedules, medication, and create beautiful memories with comprehensive pet care features.",
  keywords: [
    "pet care",
    "pet journal", 
    "pet health tracking",
    "pet management",
    "veterinary records",
    "pet feeding tracker",
    "pet medication reminder",
    "pet weight tracking",
    "pet care app",
    "dog health",
    "cat health",
    "pet wellness",
    "pet monitoring",
    "pet activities",
    "pet diary",
    "animal health",
    "pet care software",
    "crittr",
    "pet parents",
    "pet tracking"
  ],
  authors: [{ name: "Crittr Team" }],
  creator: "Crittr",
  publisher: "Crittr",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crittr.app",
    siteName: "Crittr",
    title: "Crittr - The Journaling & Tracking App for Pet Parents",
    description: "Crittr is the journaling and tracking app for pet parents. Track your pet's health, daily activities, feeding schedules, medication, and create beautiful memories.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Crittr - The Journaling & Tracking App for Pet Parents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@crittr_app",
    creator: "@crittr_app",
    title: "Crittr - The Journaling & Tracking App for Pet Parents",
    description: "Crittr is the journaling and tracking app for pet parents. Track your pet's health, daily activities, and create beautiful memories.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://crittr.app",
  },
  category: "Pet Care",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" }
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Crittr",
    "application-name": "Crittr",
    "msapplication-TileColor": "#3b82f6",
    "theme-color": "#3b82f6",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${nunitoSans.variable} ${inter.variable} ${roboto.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        {/* Skip Links for Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <a 
          href="#navigation" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to navigation
        </a>
        
        <AuthProvider>
          <ReduxProvider>
            <NotificationProvider>
              <PerformanceMonitor />
              <main id="main-content" className="content-area">
                {children}
              </main>
              <Footer />
              <FloatingChatbot />
            </NotificationProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

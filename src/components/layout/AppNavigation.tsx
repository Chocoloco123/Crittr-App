'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bell, 
  User,
  LogOut,
  Home,
  Shield,
  LogIn
} from 'lucide-react'
import Image from 'next/image'
import NavigationDropdown from './NavigationDropdown'
import AuthModal from '@/components/auth/AuthModal'
import './Navigation/Navigation.scss'

interface AppNavigationProps {
  currentPage: string
}

export default function AppNavigation({ currentPage }: AppNavigationProps) {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen)

  // Don't show navigation dropdown on home page
  const isHomePage = pathname === '/'

  if (!mounted || status === 'loading') {
    return (
      <header className="header-container">
        <div className="header-content">
          <div className="header-inner">
            <div className="logo-section">
              <div className="logo-link">
                <Image 
                  src="/images/icons/pawsIcon.png" 
                  alt="Crittr Logo" 
                  width={40} 
                  height={27}
                  className="h-[27px] w-10 object-contain"
                  priority
                />
                <div className="flex flex-col">
                  <span className="logo-text">Crittr</span>
                  <span className="logo-subtitle">Pet Wellness Simplified</span>
                </div>
              </div>
            </div>
            <div className="desktop-auth-container">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
    <header className="header-container">
      <div className="header-content">
        <div className="header-inner">
          <div className="logo-section">
            <Link 
              href="/" 
              className="logo-link"
              aria-label="Crittr - Home"
            >
              <Image 
                src="/images/icons/pawsIcon.png" 
                alt="Crittr Logo" 
                width={56} 
                height={37}
                className="h-[37px] w-14 object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="logo-text">Crittr</span>
                <span className="logo-subtitle">Pet Wellness Simplified</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 ml-8">
              <Link href="/" className="flex items-center space-x-1 hover:text-2c8d9b transition-colors">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/dashboard" className="hover:text-2c8d9b transition-colors">
                <span>Dashboard</span>
              </Link>
              {currentPage !== 'Dashboard' && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">{currentPage}</span>
                </>
              )}
            </div>
          </div>

          {/* Desktop Auth Container */}
          <div className="desktop-auth-container">
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="welcome-text">Welcome, {session.user?.name || session.user?.email}</span>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Account Settings"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="auth-button"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={toggleAuthModal}
                className="auth-button"
              >
                Login
              </button>
            )}
            
            {/* Navigation Dropdown - only show on non-home pages */}
            {!isHomePage && <NavigationDropdown currentPage={currentPage} />}
          </div>

          {/* Mobile Controls Section */}
          <div className="mobile-controls-section">
            <div className="mobile-auth-container">
              {session ? (
                <div className="flex items-center gap-2">
                  <span className="welcome-text">Welcome, {session.user?.name || session.user?.email}</span>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Account Settings"
                  >
                    <User className="h-4 w-4 text-gray-600" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="mobile-sign-out-button"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleAuthModal}
                  className="mobile-sign-in-button"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Auth Modal */}
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
  </>
  )
}

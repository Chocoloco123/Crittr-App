'use client'

import { useState } from 'react'
import { Menu, X, User, LogIn, ArrowRight, Heart, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import AuthModal from '@/components/auth/AuthModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { data: session, status } = useSession()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen)
  
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Don't render auth buttons until session is loaded
  if (status === 'loading') {
    return (
      <header className="bg-blue-50 backdrop-blur-md sticky top-0 z-50 shadow-lg" role="banner">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center h-16">
              <a 
                href="/" 
                className="flex items-center space-x-3 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors group h-full"
                aria-label="Crittr - Home"
              >
                <Image 
                  src="/images/icons/pawsIcon.png" 
                  alt="Crittr Logo" 
                  width={44} 
                  height={29}
                  className="h-[29px] w-11 object-contain"
                  priority
                />
                <div className="flex flex-col justify-center">
                  <span className="text-primary-600 font-bold text-lg leading-tight">Crittr</span>
                  <span className="text-xs text-gray-500 font-normal leading-tight">Pet Care & Journaling</span>
                </div>
              </a>
            </div>
            
            {/* Loading state */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Mobile loading state */}
            <div className="md:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '/dashboard/journal', label: 'Journal' },
    { href: '/dashboard/analytics', label: 'Health' },
    { href: '#about', label: 'About' }
  ]

  return (
    <>
      <header className="bg-blue-50 backdrop-blur-md sticky top-0 z-50 shadow-lg" role="banner">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center h-16">
              <a 
                href="/" 
                className="flex items-center space-x-3 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors group h-full"
                aria-label="Crittr - Home"
              >
                <Image 
                  src="/images/icons/pawsIcon.png" 
                  alt="Crittr Logo" 
                  width={44} 
                  height={29}
                  className="h-[29px] w-11 object-contain"
                  priority
                />
                <div className="flex flex-col justify-center">
                  <span className="text-primary-600 font-bold text-lg leading-tight">Crittr</span>
                  <span className="text-xs text-gray-500 font-normal leading-tight">Pet Care & Journaling</span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav id="navigation" className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {session ? (
                // Authenticated user
                <>
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>{session.user?.email}</span>
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                // Not authenticated
                <>
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <button
                    onClick={toggleAuthModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={toggleAuthModal}
                    className="btn btn-primary px-6 py-2 text-sm font-medium"
                  >
                    <Heart className="h-4 w-4" />
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-blue-50"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="container py-4 space-y-1">
                {navItems.map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  {session ? (
                    // Authenticated user mobile
                    <>
                      <a
                        href="/dashboard/settings"
                        className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>{session.user?.email}</span>
                      </a>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    // Not authenticated mobile
                    <>
                      <button
                        onClick={() => {
                          toggleAuthModal()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </button>
                      <button
                        onClick={() => {
                          toggleAuthModal()
                          setIsMenuOpen(false)
                        }}
                        className="btn btn-primary w-full justify-center"
                      >
                        <Heart className="h-4 w-4" />
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

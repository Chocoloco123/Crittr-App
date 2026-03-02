'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu,
  X,
  Home, 
  Calendar, 
  Activity, 
  Bell, 
  BarChart3, 
  Bot, 
  ArrowRight,
  User,
  Camera
} from 'lucide-react'

interface NavigationDropdownProps {
  currentPage?: string
}

export default function NavigationDropdown({ currentPage: _currentPage }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const navigationItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      color: 'text-gray-700',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      description: 'Overview'
    },
    {
      href: '/dashboard/journal',
      icon: Calendar,
      label: 'Journal',
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      description: 'Entries'
    },
    {
      href: '/dashboard/albums',
      icon: Camera,
      label: 'Photo Albums',
      color: 'text-teal-700',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      description: 'Photos'
    },
    {
      href: '/dashboard/quick-log',
      icon: Activity,
      label: 'Quick Log',
      color: 'text-green-700',
      bgColor: 'bg-green-50 hover:bg-green-100',
      description: 'Fast Log'
    },
    {
      href: '/dashboard/reminders',
      icon: Bell,
      label: 'Reminders',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      description: 'Alerts'
    },
    {
      href: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      description: 'Insights'
    },
    {
      href: '/dashboard/ai-assistant',
      icon: Bot,
      label: 'AI Assistant',
      color: 'text-purple-700',
      bgColor: 'bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100',
      description: 'AI Help'
    },
    {
      href: '/dashboard/export',
      icon: ArrowRight,
      label: 'Export',
      color: 'text-red-700',
      bgColor: 'bg-red-50 hover:bg-red-100',
      description: 'Data'
    },
    {
      href: '/dashboard/settings',
      icon: User,
      label: 'Account',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Settings'
    }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-dropdown-button"
        aria-label="Navigation menu"
      >
        {isOpen ? (
          <X className="h-10 w-10" />
        ) : (
          <Menu className="h-10 w-10" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="nav-dropdown-menu"
          >
            {navigationItems.map((item) => {
              const isCurrentPage = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`nav-dropdown-item ${isCurrentPage ? 'bg-gray-50 font-semibold' : ''}`}>
                    {item.label}
                  </div>
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

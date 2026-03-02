'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, 
  Calendar, 
  Activity, 
  Bell, 
  BarChart3, 
  Users, 
  ArrowRight
} from 'lucide-react'

interface QuickNavigationProps {
  currentPage?: string
}

export default function QuickNavigation({ currentPage }: QuickNavigationProps) {
  const navigationItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      color: 'bg-gray-100 hover:bg-gray-200',
      textColor: 'text-gray-700',
      description: 'Overview'
    },
    {
      href: '/dashboard/journal',
      icon: Calendar,
      label: 'Journal',
      color: 'bg-indigo-100 hover:bg-indigo-200',
      textColor: 'text-indigo-700',
      description: 'Entries'
    },
    {
      href: '/dashboard/quick-log',
      icon: Activity,
      label: 'Quick Log',
      color: 'bg-green-100 hover:bg-green-200',
      textColor: 'text-green-700',
      description: 'Fast Log'
    },
    {
      href: '/dashboard/reminders',
      icon: Bell,
      label: 'Reminders',
      color: 'bg-purple-100 hover:bg-purple-200',
      textColor: 'text-purple-700',
      description: 'Alerts'
    },
    {
      href: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
      color: 'bg-orange-100 hover:bg-orange-200',
      textColor: 'text-orange-700',
      description: 'Insights'
    },
    // TODO: Re-enable when AI Assistant is ready
    // {
    //   href: '/ai-assistant',
    //   icon: Bot,
    //   label: 'AI Assistant',
    //   color: 'bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200',
    //   textColor: 'text-purple-700',
    //   description: 'AI Help'
    // },
    {
      href: '/dashboard/social',
      icon: Users,
      label: 'Community',
      color: 'bg-pink-100 hover:bg-pink-200',
      textColor: 'text-pink-700',
      description: 'Social'
    },
    {
      href: '/dashboard/export',
      icon: ArrowRight,
      label: 'Export',
      color: 'bg-red-100 hover:bg-red-200',
      textColor: 'text-red-700',
      description: 'Data'
    }
  ]

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {navigationItems.map((item, _index) => {
            const Icon = item.icon
            const isCurrentPage = currentPage?.toLowerCase() === item.label.toLowerCase()
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full ${item.color} ${item.textColor} p-3 rounded-lg text-center transition-colors flex flex-col items-center space-y-2 ${
                    isCurrentPage ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  title={item.description}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

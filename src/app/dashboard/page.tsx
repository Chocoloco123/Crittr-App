'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Calendar, 
  Bell, 
  Heart,
  Activity,
  Clock,
  Bot,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import PetProfiles from '@/components/pets/PetProfiles'
import AppNavigation from '@/components/layout/AppNavigation'
import { DemoStorage } from '@/lib/demoStorage'
import AuthModal from '@/components/auth/AuthModal'
import './page.scss'

interface DashboardJournalEntry {
  id: string
  title: string
  createdAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null)
  
  // Available pet icons
  const petIcons = [
    'dog.png',
    'cat.png', 
    'goldenretriever.png',
    'hamster.png',
    'fish.png',
    'lizard.png',
    'horse.png',
    'guineapig.png'
  ]
  
  // Select a random pet icon
  const selectedPetIcon = petIcons[Math.floor(Math.random() * petIcons.length)]
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load dashboard data from demo storage
    const savedData = DemoStorage.getItem<Record<string, unknown>>('dashboard-data')
    if (savedData) {
      setDashboardData(savedData)
    }
  }, [])

  // Save dashboard data to demo storage whenever data changes
  useEffect(() => {
    if (mounted && dashboardData) {
      DemoStorage.setItem('dashboard-data', dashboardData)
    }
  }, [dashboardData, mounted])

  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen)

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  // Demo data for unauthenticated users
  const demoStats = [
    { label: 'Total Pets', value: '3', icon: Heart, color: 'text-2c8d9b', bgColor: 'bg-teal-50' },
    { label: 'Journal Entries', value: '12', icon: Calendar, color: 'text-FE9F72', bgColor: 'bg-orange-50' },
    { label: 'Quick Logs', value: '28', icon: Activity, color: 'text-2c8d9b', bgColor: 'bg-teal-50' },
    { label: 'Active Reminders', value: '5', icon: Bell, color: 'text-FE9F72', bgColor: 'bg-orange-50' }
  ]

  const demoRecentActivities = [
    { id: 1, activity: 'Morning walk', pet: 'Buddy', time: '2 hours ago', type: 'Exercise' },
    { id: 2, activity: 'Fed breakfast', pet: 'Luna', time: '3 hours ago', type: 'Feeding' },
    { id: 3, activity: 'Vet checkup', pet: 'Max', time: '1 day ago', type: 'Health' },
    { id: 4, activity: 'Playtime', pet: 'Buddy', time: '2 days ago', type: 'Activity' }
  ]

  const demoUpcomingReminders = [
    { id: 1, title: 'Feed Luna', pet: 'Luna', time: 'In 2 hours' },
    { id: 2, title: 'Walk Buddy', pet: 'Buddy', time: 'Tomorrow 8 AM' },
    { id: 3, title: 'Grooming appointment', pet: 'Max', time: 'Friday 2 PM' }
  ]

  // Fetch journal entries for recent activities
  const [journalEntries, setJournalEntries] = useState<DashboardJournalEntry[]>([])
  
  useEffect(() => {
    if (mounted) {
      // Fetch journal entries from demo storage
      const entries = DemoStorage.getItem<DashboardJournalEntry[]>('journal-entries') || []
      setJournalEntries(entries)
    }
  }, [mounted])

  // Real user data - will be fetched from API in the future
  const userStats = [
    { label: 'Total Pets', value: '0', icon: Heart, color: 'text-2c8d9b', bgColor: 'bg-teal-50' },
    { label: 'Journal Entries', value: journalEntries.length.toString(), icon: Calendar, color: 'text-FE9F72', bgColor: 'bg-orange-50' },
    { label: 'Quick Logs', value: '0', icon: Activity, color: 'text-2c8d9b', bgColor: 'bg-teal-50' },
    { label: 'Active Reminders', value: '0', icon: Bell, color: 'text-FE9F72', bgColor: 'bg-orange-50' }
  ]

  // Convert journal entries to recent activities format
  const userRecentActivities = journalEntries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) // Show only the 5 most recent
    .map(entry => ({
      id: entry.id,
      description: entry.title,
      time: formatTimeAgo(entry.createdAt),
      icon: Activity
    }))

  const userUpcomingReminders: Array<{ id: string; title: string; pet?: string; time: string }> = []

  // Use demo data if not authenticated, user data if authenticated
  const stats = session ? userStats : demoStats
  const recentActivities = session ? userRecentActivities : demoRecentActivities
  const upcomingReminders = session ? userUpcomingReminders : demoUpcomingReminders
  const isDemoMode = !session

  const quickActions = [
    { 
      title: 'Journal Entry', 
      description: 'Record daily activities', 
      icon: Calendar, 
      href: '/dashboard/journal',
      iconClass: 'dashboard-action-icon-teal',
      textClass: 'dashboard-action-text-teal'
    },
    { 
      title: 'Quick Log', 
      description: 'Fast activity logging', 
      icon: Activity, 
      href: '/dashboard/quick-log',
      iconClass: 'dashboard-action-icon-orange',
      textClass: 'dashboard-action-text-orange'
    },
    { 
      title: 'Add Pet', 
      description: 'Register new pet', 
      icon: Plus, 
      href: '#',
      iconClass: 'dashboard-action-icon-teal',
      textClass: 'dashboard-action-text-teal'
    },
    { 
      title: 'AI Assistant', 
      description: 'Get health insights', 
      icon: Bot, 
      href: '/dashboard/ai-assistant',
      iconClass: 'dashboard-action-icon-orange',
      textClass: 'dashboard-action-text-orange'
    }
  ]

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <AppNavigation currentPage="Dashboard" />

      <main className="dashboard-container">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="dashboard-welcome-section"
        >
          <div className="dashboard-welcome-container">
            <div className="dashboard-welcome-grid">
              {/* Left Side - Content */}
              <div className="dashboard-welcome-content">
                {/* Main Heading */}
                <div className="mb-6">
                  <h1 className="dashboard-welcome-title">
                    {isDemoMode ? (
                      <>
                        Welcome to Crittr! 
                      </>
                    ) : (
                      <>
                        Welcome back, {session.user?.name || session.user?.email || 'there'}!
                      </>
                    )}
                  </h1>
                  {isDemoMode && (
                    <div className="dashboard-demo-badge">
                      <span className="dashboard-demo-pulse"></span>
                      Demo Mode
                    </div>
                  )}
                </div>

                {/* Subtitle */}
                <div className="max-w-2xl">
                  <p className="dashboard-welcome-subtitle">
                    {isDemoMode ? (
                      <>Explore our pet care platform with sample data. Experience the full features before creating your account!</>
                    ) : (
                      <>Here&apos;s what&apos;s happening with your pets today. Let&apos;s keep them happy and healthy together!</>
                    )}
                  </p>
                  
                  {/* Call to Action */}
                  <div className="dashboard-welcome-actions">
                    {isDemoMode ? (
                      <>
                        <Link 
                          href="/" 
                          className="dashboard-primary-button"
                        >
                          <span>Get Started</span>
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={toggleAuthModal}
                          className="dashboard-secondary-button"
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      <Link 
                        href="/dashboard/quick-log" 
                        className="dashboard-primary-button"
                      >
                        <span>Log Activity</span>
                        <Plus className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Pet Icon */}
              <div className="dashboard-welcome-pet-container">
                <div className="dashboard-welcome-pet-wrapper">
                  <div className="dashboard-welcome-pet-background">
                    <Image 
                      src={`/images/icons/${selectedPetIcon}`} 
                      alt="Pet Icon" 
                      width={400} 
                      height={400}
                      className="dashboard-welcome-pet-image"
                      priority
                      quality={50}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 400px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="dashboard-section"
        >
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              Quick Actions
            </h2>
          </div>
          <div className="dashboard-section-content">
            <div className="dashboard-actions-grid">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="dashboard-action-card">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className={`dashboard-action-icon ${action.iconClass}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`dashboard-action-title ${action.textClass}`}>
                        {action.title}
                      </h3>
                      <p className={`dashboard-action-description ${action.textClass}`}>
                        {action.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pet Profiles Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <PetProfiles isDemoMode={isDemoMode} />
        </motion.div>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="dashboard-stat-card"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`dashboard-stat-icon ${stat.bgColor}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="dashboard-stat-value">
                    {stat.value}
                  </p>
                  <p className="dashboard-stat-label">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content-grid">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="dashboard-section"
          >
            <div className="dashboard-section-header">
              <div className="flex items-center justify-between">
                <h2 className="dashboard-section-title">
                  Recent Activities
                </h2>
                <Link href="/dashboard/journal" className="group inline-flex items-center px-4 py-2 text-sm font-semibold text-2c8d9b hover:text-247a85 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 whitespace-nowrap">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
            <div className="dashboard-section-content">
              <div className="space-y-6">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="dashboard-activity-item"
                    >
                      <div className="dashboard-activity-icon">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="dashboard-activity-content">
                        <p className="dashboard-activity-title">
                          {(activity as { activity?: string; description?: string; pet?: string }).activity || (activity as { activity?: string; description?: string }).description} - {(activity as { pet?: string }).pet || 'Your Pet'}
                        </p>
                        <p className="dashboard-activity-time">
                          {activity.time}
                        </p>
                      </div>
                        <span className="dashboard-activity-type">
                          {(activity as { type?: string }).type || 'Activity'}
                        </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="dashboard-empty-state">
                    <div className="dashboard-empty-icon">
                      <Activity className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="dashboard-empty-title">No activities yet</h3>
                    <p className="dashboard-empty-description">Start tracking your pet&apos;s activities to see them here.</p>
                    <Link 
                      href="/quick-log" 
                      className="dashboard-empty-button"
                    >
                      <Activity className="h-4 w-4" />
                      Log First Activity
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="dashboard-section"
          >
            <div className="dashboard-section-header">
              <div className="flex items-center justify-between">
                <h2 className="dashboard-section-title">
                  Upcoming Reminders
                </h2>
                <Link href="/dashboard/reminders" className="group inline-flex items-center px-4 py-2 text-sm font-semibold text-2c8d9b hover:text-247a85 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 whitespace-nowrap">
                  <span>Manage</span>
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
            <div className="dashboard-section-content">
              <div className="space-y-6">
                {upcomingReminders.length > 0 ? (
                  upcomingReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="dashboard-reminder-item"
                    >
                      <div className="dashboard-reminder-icon">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="dashboard-reminder-content">
                        <p className="dashboard-reminder-title">
                          {reminder.title}
                        </p>
                        <p className="dashboard-reminder-details">
                          {reminder.pet} • {reminder.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="dashboard-empty-state">
                    <div className="dashboard-empty-icon">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="dashboard-empty-title">No reminders set</h3>
                    <p className="dashboard-empty-description">Set up reminders to keep track of your pet&apos;s schedule.</p>
                    <Link 
                      href="/dashboard/reminders" 
                      className="dashboard-empty-button"
                    >
                      <Clock className="h-4 w-4" />
                      Create First Reminder
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}

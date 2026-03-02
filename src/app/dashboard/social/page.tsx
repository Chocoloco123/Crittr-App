'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import SocialFeatures from '@/components/social/SocialFeatures'
import AppNavigation from '@/components/layout/AppNavigation'
import { DemoStorage } from '@/lib/demoStorage'
import './page.scss'

export default function SocialPage() {
  const { data: _session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedPetName, setSelectedPetName] = useState<string>('')
  const [socialData, setSocialData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Load social data from demo storage
    const savedData = DemoStorage.getItem<Record<string, unknown>>('social-data')
    if (savedData) {
      setSocialData(savedData)
    }
  }, [])

  // Save social data to demo storage whenever data changes
  useEffect(() => {
    if (mounted && socialData) {
      DemoStorage.setItem('social-data', socialData)
    }
  }, [socialData, mounted])

  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading social features...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="social-page">
      {/* Header */}
      <AppNavigation currentPage="Social" />

      <main className="social-container">
        {/* Social Header */}
        <div className="social-header">
          <h1 className="social-title">👥 Social</h1>
          <p className="social-subtitle">Connect with other pet owners and share experiences</p>
        </div>

        {/* Social Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="social-content"
        >
          <SocialFeatures
            petId={selectedPetId}
            petName={selectedPetName}
          />
        </motion.div>
      </main>
    </div>
  )
}

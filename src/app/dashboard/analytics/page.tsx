'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Analytics from '@/components/analytics/Analytics'
import AppNavigation from '@/components/layout/AppNavigation'
import { DemoStorage } from '@/lib/demoStorage'
import './page.scss'

export default function AnalyticsPage() {
  const { data: _session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedPetName, setSelectedPetName] = useState<string>('')
  const [analyticsData, setAnalyticsData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Load analytics data from demo storage
    const savedData = DemoStorage.getItem<Record<string, unknown>>('analytics-data')
    if (savedData) {
      setAnalyticsData(savedData)
    }
  }, [])

  // Save analytics data to demo storage whenever data changes
  useEffect(() => {
    if (mounted && analyticsData) {
      DemoStorage.setItem('analytics-data', analyticsData)
    }
  }, [analyticsData, mounted])

  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <AppNavigation currentPage="Analytics" />

      <main className="analytics-container">
        {/* Analytics Header */}
        <div className="analytics-header">
          <h1 className="analytics-title">📊 Analytics</h1>
          <p className="analytics-subtitle">Track your pet&apos;s health trends and insights</p>
        </div>

        {/* Pet Selection */}
        <div className="analytics-pet-selection">
          <div className="analytics-pet-selection-header">
            <h3 className="analytics-pet-selection-title">Select Pet</h3>
            <button
              onClick={() => {
                setSelectedPetId('')
                setSelectedPetName('')
              }}
              className={`analytics-pet-selection-button ${
                selectedPetId === '' ? 'active' : 'inactive'
              }`}
            >
              View All Pets
            </button>
          </div>
          <div className="analytics-pet-selection-content">
            <div className="analytics-pet-grid">
              {[
                { id: '1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever' },
                { id: '2', name: 'Luna', type: 'Cat', breed: 'Maine Coon' },
                { id: '3', name: 'Max', type: 'Dog', breed: 'Labrador' }
              ].map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    // Toggle: if already selected, deselect; otherwise select
                    if (selectedPetId === pet.id) {
                      setSelectedPetId('')
                      setSelectedPetName('')
                    } else {
                      setSelectedPetId(pet.id)
                      setSelectedPetName(pet.name)
                    }
                  }}
                  className={`analytics-pet-card ${
                    selectedPetId === pet.id ? 'selected' : ''
                  }`}
                >
                  <div className="analytics-pet-avatar">
                    {pet.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="analytics-pet-name">{pet.name}</h4>
                    <p className="analytics-pet-breed">{pet.breed}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="analytics-content"
        >
          <Analytics
            petId={selectedPetId}
            petName={selectedPetName}
          />
        </motion.div>
      </main>
    </div>
  )
}

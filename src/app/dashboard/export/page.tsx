'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import ExportFeatures from '@/components/export/ExportFeatures'
import AppNavigation from '@/components/layout/AppNavigation'
import { DemoStorage } from '@/lib/demoStorage'
import './page.scss'

export default function ExportPage() {
  const { data: _session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedPetName, setSelectedPetName] = useState<string>('')
  const [exportHistory, setExportHistory] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    setMounted(true)
    
    // Load export history from demo storage
    const savedHistory = DemoStorage.getItem<Array<Record<string, unknown>>>('export-history')
    if (savedHistory) {
      setExportHistory(savedHistory)
    }
  }, [])

  // Save export history to demo storage whenever history changes
  useEffect(() => {
    if (mounted) {
      DemoStorage.setItem('export-history', exportHistory)
    }
  }, [exportHistory, mounted])

  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading export...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="export-page">
      {/* Header */}
      <AppNavigation currentPage="Export" />

      <main className="export-container">
        {/* Export Header */}
        <div className="export-header">
          <h1 className="export-title">📤 Export Data</h1>
          <p className="export-subtitle">Export your pet&apos;s data and records</p>
        </div>

        {/* Pet Selection */}
        <div className="export-pet-selection">
          <div className="export-pet-selection-header">
            <h3 className="export-pet-selection-title">Select Pet</h3>
          </div>
          <div className="export-pet-selection-content">
            <div className="export-pet-grid">
              {[
                { id: '1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever' },
                { id: '2', name: 'Luna', type: 'Cat', breed: 'Maine Coon' },
                { id: '3', name: 'Max', type: 'Dog', breed: 'Labrador' }
              ].map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    setSelectedPetId(pet.id)
                    setSelectedPetName(pet.name)
                  }}
                  className={`export-pet-card ${
                    selectedPetId === pet.id ? 'selected' : ''
                  }`}
                >
                  <div className="export-pet-avatar">
                    {pet.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="export-pet-name">{pet.name}</h4>
                    <p className="export-pet-breed">{pet.breed}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Export Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="export-content"
        >
          <ExportFeatures
            petId={selectedPetId}
            petName={selectedPetName}
          />
        </motion.div>
      </main>
    </div>
  )
}

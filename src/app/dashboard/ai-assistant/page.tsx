'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import AIAssistant from '@/components/ai/AIAssistant'
import AppNavigation from '@/components/layout/AppNavigation'
import { DemoStorage } from '@/lib/demoStorage'
import './page.scss'

export default function AIAssistantPage() {
  const { data: _session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedPetName, setSelectedPetName] = useState<string>('')
  const [conversations, setConversations] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    setMounted(true)
    
    // Load AI conversations from demo storage
    const savedConversations = DemoStorage.getItem<Array<Record<string, unknown>>>('ai-conversations')
    if (savedConversations) {
      setConversations(savedConversations)
    }
  }, [])

  // Save conversations to demo storage whenever conversations change
  useEffect(() => {
    if (mounted) {
      DemoStorage.setItem('ai-conversations', conversations)
    }
  }, [conversations, mounted])

  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading AI assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-assistant-page">
      {/* Header */}
      <AppNavigation currentPage="AI Assistant" />

      <main className="ai-assistant-container">
        {/* AI Assistant Header */}
        <div className="ai-assistant-header">
          <h1 className="ai-assistant-title">🤖 AI Assistant</h1>
          <p className="ai-assistant-subtitle">Get personalized pet care advice and health insights</p>
        </div>

        {/* Pet Selection */}
        <div className="ai-assistant-pet-selection">
          <div className="ai-assistant-pet-selection-header">
            <h3 className="ai-assistant-pet-selection-title">Select Pet</h3>
          </div>
          <div className="ai-assistant-pet-selection-content">
            <div className="ai-assistant-pet-grid">
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
                  className={`ai-assistant-pet-card ${
                    selectedPetId === pet.id ? 'selected' : ''
                  }`}
                >
                  <div className="ai-assistant-pet-avatar">
                    {pet.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="ai-assistant-pet-name">{pet.name}</h4>
                    <p className="ai-assistant-pet-breed">{pet.breed}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Assistant Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="ai-assistant-content"
        >
          <AIAssistant
            petId={selectedPetId}
            petName={selectedPetName}
          />
        </motion.div>
      </main>
    </div>
  )
}
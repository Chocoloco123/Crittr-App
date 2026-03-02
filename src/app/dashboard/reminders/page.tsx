'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import RemindersList from '@/components/reminders/RemindersList'
import ReminderForm from '@/components/reminders/ReminderForm'
import AppNavigation from '@/components/layout/AppNavigation'
import { useDemoStorageArray } from '@/lib/hooks/useDemoStorage'
import { useNotify } from '@/components/providers/NotificationProvider'
import './page.scss'

interface Reminder {
  id: string
  title: string
  description?: string
  petId: string
  petName: string
  reminderType: 'feeding' | 'medication' | 'exercise' | 'vet_visit' | 'grooming' | 'weight' | 'general'
  time: string
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  isActive: boolean
  createdAt: string
  lastTriggered?: string
}

export default function RemindersPage() {
  const { data: _session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedPetName, setSelectedPetName] = useState<string>('')
  const { success } = useNotify()
  
  // Demo mock data for unauthenticated users
  const mockReminders: Reminder[] = [
    {
      id: '1',
      title: 'Morning Feeding',
      description: 'Feed Buddy his breakfast',
      petId: '1',
      petName: 'Buddy',
      reminderType: 'feeding',
      time: '08:00',
      frequency: 'daily',
      isActive: true,
      createdAt: '2024-01-15T08:00:00Z',
      lastTriggered: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      title: 'Evening Medication',
      description: 'Give Luna her heart medication',
      petId: '2',
      petName: 'Luna',
      reminderType: 'medication',
      time: '20:00',
      frequency: 'daily',
      isActive: true,
      createdAt: '2024-01-14T20:00:00Z',
      lastTriggered: '2024-01-14T20:00:00Z'
    },
    {
      id: '3',
      title: 'Weekly Weight Check',
      description: 'Weigh Max and record in journal',
      petId: '3',
      petName: 'Max',
      reminderType: 'weight',
      time: '10:00',
      frequency: 'weekly',
      isActive: true,
      createdAt: '2024-01-10T10:00:00Z'
    }
  ]

  // Use optimized demo storage hook with mock data as default
  const { data: reminders, addItem: addReminder, updateItem: updateReminder, removeItem: removeReminder } = useDemoStorageArray<Reminder>('reminders', mockReminders)

  useEffect(() => {
    setMounted(true)
  }, [])

  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleNewReminder = () => {
    setEditingReminder(null)
    setShowForm(true)
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setShowForm(true)
  }

  const handleSaveReminder = (reminderData: Omit<Reminder, 'id' | 'createdAt'>) => {
    // In a real app, this would save to the backend
    
    // Mock save - generate ID and timestamp
    const newReminder: Reminder = {
      ...reminderData,
      id: editingReminder?.id || `reminder-${Date.now()}`,
      createdAt: editingReminder?.createdAt || new Date().toISOString()
    }
    
    if (editingReminder) {
      // Update existing reminder
      updateReminder(editingReminder.id, newReminder)
      success('Reminder Updated!', `"${reminderData.title}" updated successfully`, 4000)
    } else {
      // Add new reminder
      addReminder(newReminder)
      success('Reminder Created!', `"${reminderData.title}" created successfully`, 4000)
    }
    
    setShowForm(false)
    setEditingReminder(null)
  }

  const handleDeleteReminder = (reminderId: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      // In a real app, this would delete from the backend
      removeReminder(reminderId)
      success('Reminder Deleted!', 'Reminder deleted successfully', 3000)
    }
  }

  const handleToggleReminder = (reminderId: string) => {
    // In a real app, this would update the backend
    const reminder = reminders.find(r => r.id === reminderId)
    if (reminder) {
      const updatedReminder = { ...reminder, isActive: !reminder.isActive }
      updateReminder(reminderId, updatedReminder)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingReminder(null)
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading reminders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reminders-page">
      {/* Header */}
      <AppNavigation currentPage="Reminders" />

      <main className="reminders-container">
        {/* Reminders Header */}
        <div className="reminders-header">
          <h1 className="reminders-title">🔔 Reminders</h1>
          <p className="reminders-subtitle">Never miss important pet care tasks</p>
        </div>

        {/* Pet Selection */}
        <div className="reminders-pet-selection">
          <div className="reminders-pet-selection-header">
            <h3 className="reminders-pet-selection-title">Select Pet</h3>
            <button
              onClick={() => {
                setSelectedPetId('')
                setSelectedPetName('')
              }}
              className={`reminders-pet-selection-button ${
                selectedPetId === '' ? 'active' : 'inactive'
              }`}
            >
              View All Pets
            </button>
          </div>
          <div className="reminders-pet-selection-content">
            <div className="reminders-pet-grid">
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
                  className={`reminders-pet-card ${
                    selectedPetId === pet.id ? 'selected' : ''
                  }`}
                >
                  <div className="reminders-pet-avatar">
                    {pet.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="reminders-pet-name">{pet.name}</h4>
                    <p className="reminders-pet-breed">{pet.breed}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reminders Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="reminders-content"
        >
          <RemindersList
            petId={selectedPetId || undefined}
            petName={selectedPetName || undefined}
            reminders={reminders}
            onNewReminder={handleNewReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
            onToggleReminder={handleToggleReminder}
          />
        </motion.div>
      </main>

      {/* Reminder Form Modal */}
      {showForm && (
        <ReminderForm
          petId={selectedPetId}
          petName={selectedPetName}
          onSave={handleSaveReminder}
          onCancel={handleCancelForm}
          initialData={editingReminder || undefined}
        />
      )}
    </div>
  )
}

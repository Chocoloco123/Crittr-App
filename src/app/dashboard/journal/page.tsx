'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { FileText } from 'lucide-react'
import JournalList from '@/components/journal/JournalList'
import JournalEditor from '@/components/journal/JournalEditor'
import AppNavigation from '@/components/layout/AppNavigation'
import { useDemoStorageArray } from '@/lib/hooks/useDemoStorage'
import { useNotify } from '@/components/providers/NotificationProvider'
import type { JournalEntry } from '@/types/journal'
import './page.scss'

export default function JournalPage() {
  const { data: _session, status: _status } = useSession()
  const { journal: showJournalNotification } = useNotify()
  const [_mounted, setMounted] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [selectedPetId, setSelectedPetId] = useState<string>('all')
  const [selectedPetName, setSelectedPetName] = useState<string>('All Pets')
  
  // Use optimized demo storage hook
  const { data: entries, addItem: addEntry, updateItem: updateEntry, removeItem: removeEntry } = useDemoStorageArray<JournalEntry>('journal-entries')

  // Demo pets data - in a real app this would come from your pet management system
  const demoPets = [
    { id: '1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', avatar: '🐕' },
    { id: '2', name: 'Luna', type: 'Cat', breed: 'Maine Coon', avatar: '🐱' },
    { id: '3', name: 'Max', type: 'Dog', breed: 'Labrador', avatar: '🐕' }
  ]

  // Mock entries (same as in JournalList component)
  const mockEntries: JournalEntry[] = [
    {
      id: '1',
      title: 'Morning Feeding',
      content: 'Fed Buddy his regular breakfast. He ate everything and seemed very happy!',
      petId: '1',
      petName: 'Buddy',
      entryType: 'feeding',
      attachments: [],
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:00Z'
    },
    {
      id: '2',
      title: 'Vet Checkup',
      content: 'Annual checkup went well. Dr. Smith said Buddy is in excellent health. Weight is stable at 25kg.',
      petId: '1',
      petName: 'Buddy',
      entryType: 'vet_visit',
      attachments: [
        {
          id: 'att1',
          type: 'document',
          url: '/mock-vet-report.pdf',
          name: 'Vet Report.pdf',
          size: 1024000
        },
        {
          id: 'att2',
          type: 'image',
          url: '/images/icons/stethescope.png',
          name: 'Vet Visit Photo.jpg',
          size: 2048000
        }
      ],
      createdAt: '2024-01-14T14:00:00Z',
      updatedAt: '2024-01-14T14:00:00Z'
    },
    {
      id: '3',
      title: 'Evening Walk',
      content: 'Took Luna for a 30-minute walk around the park. She was very energetic and met some new dog friends.',
      petId: '2',
      petName: 'Luna',
      entryType: 'exercise',
      attachments: [
        {
          id: 'att3',
          type: 'image',
          url: '/images/icons/dog.png',
          name: 'Walk Photo.jpg',
          size: 2048000
        }
      ],
      createdAt: '2024-01-14T18:00:00Z',
      updatedAt: '2024-01-14T18:00:00Z'
    }
  ]

  // Calculate entry counts based on selected pet
  const getFilteredEntries = (petId?: string) => {
    if (petId === 'all' || !petId) {
      return [...entries, ...mockEntries]
    }
    return [...entries, ...mockEntries].filter(entry => entry.petId === petId)
  }

  const filteredEntries = getFilteredEntries(selectedPetId === 'all' ? undefined : selectedPetId)
  const userEntriesForPet = entries.filter(entry => 
    selectedPetId === 'all' || entry.petId === selectedPetId
  ).length
  const mockEntriesForPet = mockEntries.filter(entry => 
    selectedPetId === 'all' || entry.petId === selectedPetId
  ).length

  const totalEntries = filteredEntries.length
  const userEntries = userEntriesForPet
  const mockEntriesCount = mockEntriesForPet

  useEffect(() => {
    setMounted(true)
    
    // Clean up any existing blob URLs in localStorage
    const existingEntries = JSON.parse(localStorage.getItem('journal-entries') || '[]')
    const cleanedEntries = existingEntries.map((entry: Record<string, unknown>) => ({
      ...entry,
      attachments: (entry.attachments as Array<Record<string, unknown>>)?.map((att: Record<string, unknown>) => ({
        ...att,
        url: (att.url as string)?.startsWith('blob:') 
          ? ((att.type as string) === 'image' ? '/images/icons/dog.png' :
             (att.type as string) === 'video' ? '/images/icons/cat.png' : 
             '/images/icons/journal.png')
          : att.url
      })) || []
    }))
    
    if (JSON.stringify(existingEntries) !== JSON.stringify(cleanedEntries)) {
      localStorage.setItem('journal-entries', JSON.stringify(cleanedEntries))
      console.log('🧹 Cleaned up blob URLs from existing journal entries')
    }
    
    // For debugging: clear all journal entries to start fresh
    // Uncomment the line below if you want to clear all existing entries
    // localStorage.removeItem('journal-entries')
  }, [])


  const _handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleClearStorage = () => {
    localStorage.removeItem('journal-entries')
    console.log('🗑️ Cleared all journal entries from localStorage')
    // Force a page refresh to reload the data
    window.location.reload()
  }

  const handleNewEntry = () => {
    setEditingEntry(null)
    setShowEditor(true)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setShowEditor(true)
  }

  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: editingEntry?.id || `entry-${Date.now()}`,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (editingEntry) {
      // Update existing entry
      updateEntry(editingEntry.id, newEntry)
      showJournalNotification(
        'Journal Entry Updated! 📝',
        `"${entryData.title}" has been updated for ${entryData.petName}`,
        4000
      )
    } else {
      // Add new entry
      addEntry(newEntry)
      showJournalNotification(
        'Journal Entry Saved! ✨',
        `"${entryData.title}" has been added to ${entryData.petName}\u2019s journal`,
        4000
      )
    }
    
    setShowEditor(false)
    setEditingEntry(null)
  }

  const handleDeleteEntry = (entryId: string) => {
    // Find the entry to get its title and pet name for the notification
    const entryToDelete = [...entries, ...mockEntries].find(entry => entry.id === entryId)
    
    removeEntry(entryId)
    showJournalNotification(
      'Journal Entry Deleted! 🗑️',
      entryToDelete 
        ? `"${entryToDelete.title}" has been deleted from ${entryToDelete.petName}\u2019s journal`
        : 'Journal entry has been removed',
      4000
    )
  }

  const handleCancelEditor = () => {
    setShowEditor(false)
    setEditingEntry(null)
  }

  return (
    <div className="journal-page">
      {/* Header */}
      <AppNavigation currentPage="Journal" />

      <main className="journal-container">
        {/* Journal Header */}
        <div className="journal-header">
          <h1 className="journal-title">📝 Pet Journal</h1>
          <p className="journal-subtitle">Capture precious moments and track your pet&apos;s health journey</p>
        </div>

        {/* Google Sheets-style Pet Tabs */}
        <div className="journal-tabs-container">
          <div className="journal-tabs-wrapper">
            <div className="journal-tabs">
              {/* All Pets Tab */}
              <button
                onClick={() => {
                  setSelectedPetId('all')
                  setSelectedPetName('All Pets')
                }}
                className={`journal-tab ${selectedPetId === 'all' ? 'active' : ''}`}
              >
                <FileText className="journal-tab-icon" />
                <span className="journal-tab-text">All Pets</span>
                {selectedPetId === 'all' && <div className="journal-tab-indicator" />}
              </button>

              {/* Individual Pet Tabs */}
              {demoPets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    setSelectedPetId(pet.id)
                    setSelectedPetName(pet.name)
                  }}
                  className={`journal-tab ${selectedPetId === pet.id ? 'active' : ''}`}
                >
                  <span className="journal-tab-avatar">{pet.avatar}</span>
                  <span className="journal-tab-text">{pet.name}</span>
                  {selectedPetId === pet.id && <div className="journal-tab-indicator" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Journal Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="journal-content"
        >
          {/* Debug button - remove this in production */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              🐛 Debug: If you&apos;re seeing blob URL errors, click the button below to clear localStorage and start fresh.
            </p>
            <button
              onClick={handleClearStorage}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
            >
              Clear Storage & Refresh
            </button>
          </div>
          
          <JournalList
            entries={entries}
            petId={selectedPetId === 'all' ? undefined : selectedPetId}
            onNewEntry={handleNewEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            totalEntries={totalEntries}
            userEntries={userEntries}
            mockEntriesCount={mockEntriesCount}
          />
        </motion.div>
      </main>

      {/* Journal Editor Modal */}
      {showEditor && (
        <JournalEditor
          petId={selectedPetId === 'all' ? '' : selectedPetId}
          petName={selectedPetName}
          onSave={handleSaveEntry}
          onCancel={handleCancelEditor}
          initialData={editingEntry || undefined}
          onPetChange={(petId, petName) => {
            setSelectedPetId(petId)
            setSelectedPetName(petName)
          }}
        />
      )}
    </div>
  )
}

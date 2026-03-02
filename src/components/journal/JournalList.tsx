'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Heart, 
  Pill, 
  Activity, 
  Stethoscope, 
  Scissors, 
  Weight, 
  PawPrint,
  FileText,
  Image,
  Video,
  Download,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import JournalEntryDetails from './JournalEntryDetails'
import { useNotify } from '@/components/providers/NotificationProvider'
import type { JournalEntry, Attachment } from '@/types/journal'

interface JournalListProps {
  entries: JournalEntry[]
  petId?: string
  onNewEntry: () => void
  onEditEntry: (entry: JournalEntry) => void
  onDeleteEntry: (entryId: string) => void
  totalEntries?: number
  userEntries?: number
  mockEntriesCount?: number
}

const entryTypeConfig = {
  general: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  feeding: { icon: Heart, color: 'text-green-600', bgColor: 'bg-green-100' },
  medication: { icon: Pill, color: 'text-red-600', bgColor: 'bg-red-100' },
  exercise: { icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  vet_visit: { icon: Stethoscope, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  grooming: { icon: Scissors, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  weight: { icon: Weight, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  symptoms: { icon: PawPrint, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
}

// Mock data for demonstration
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
        id: 'att2',
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

export default function JournalList({ entries, petId, onNewEntry, onEditEntry, onDeleteEntry, totalEntries = 0, userEntries = 0, mockEntriesCount = 0 }: JournalListProps) {
  const { success } = useNotify()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null)
  const entriesPerPage = 5

  // Combine actual entries with mock data for demo purposes
  const allEntries = [...entries, ...mockEntries]

  const filteredEntries = allEntries
    .filter(entry => {
      if (petId && entry.petId !== petId) return false
      if (searchTerm && !entry.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !entry.content.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (filterType !== 'all' && entry.entryType !== filterType) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.title.localeCompare(b.title)
    })

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

  const handleViewDetails = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedEntry(null)
  }

  const handleDeleteClick = (entry: JournalEntry) => {
    setEntryToDelete(entry)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (entryToDelete) {
      onDeleteEntry(entryToDelete.id)
      setShowDeleteConfirm(false)
      setEntryToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setEntryToDelete(null)
  }

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string) => {
    setFilterType(newFilter)
    setCurrentPage(1)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch)
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="journal-entries-container">
      {/* Header */}
      <div className="journal-entries-header">
        <div className="journal-entries-title-section">
          <h2 className="journal-entries-title">Journal Entries</h2>
          <p className="journal-entries-subtitle">Track your pet's daily activities and health</p>
          
          {/* Entry Counts - Tastefully displayed below subtitle */}
          <div className="journal-entries-stats">
            <div className="journal-entries-stat">
              <span className="journal-entries-number">{totalEntries}</span>
              <span className="journal-entries-label">Total</span>
            </div>
            <div className="journal-entries-stat">
              <span className="journal-entries-number">{userEntries}</span>
              <span className="journal-entries-label">Yours</span>
            </div>
            <div className="journal-entries-stat">
              <span className="journal-entries-number">{mockEntriesCount}</span>
              <span className="journal-entries-label">Demo</span>
            </div>
          </div>
        </div>
        <button
          onClick={onNewEntry}
          className="journal-new-entry-button"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Filters */}
      <div className="journal-filters">
        <div className="journal-filters-content">
          {/* Search */}
          <div className="journal-search-container">
            <div className="journal-search-wrapper">
              <Search className="journal-search-icon" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="journal-search-input"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <div className="journal-filter-container">
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="journal-filter-select"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="feeding">Feeding</option>
              <option value="medication">Medication</option>
              <option value="exercise">Exercise</option>
              <option value="vet_visit">Vet Visit</option>
              <option value="grooming">Grooming</option>
              <option value="weight">Weight</option>
              <option value="symptoms">Symptoms</option>
            </select>
          </div>

          {/* Sort */}
          <div className="journal-sort-container">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="journal-sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

      </div>

      {/* Entries List */}
      <div className="journal-entries-list">
        {paginatedEntries.length === 0 ? (
          <div className="journal-empty-state">
            <div className="journal-empty-icon">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="journal-empty-title">No entries found</h3>
            <p className="journal-empty-description">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start documenting your pet\'s activities and health'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={onNewEntry}
                className="journal-empty-button"
              >
                Create First Entry
              </button>
            )}
          </div>
        ) : (
          paginatedEntries.map((entry, index) => {
            const typeConfig = entryTypeConfig[entry.entryType]
            const Icon = typeConfig.icon
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="journal-entry-card"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${typeConfig.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(entry.createdAt)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="capitalize">{entry.entryType.replace('_', ' ')}</span>
                          </span>
                          <span>{entry.petName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit entry"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 line-clamp-3">
                      {entry.content.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>

                  {/* Attachments */}
                  {entry.attachments.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">Attachments:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {entry.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg"
                          >
                            {(() => {
                              // Determine file type and URL for both mock and backend formats
                              const getFileType = (att: any) => {
                                return att.type || att.file_type || 'document'
                              }
                              
                              const getAttachmentUrl = (att: any) => {
                                if (att.url) return att.url // Mock format
                                if (att.file_path) {
                                  const pathParts = att.file_path.split('/')
                                  const fileType = pathParts[pathParts.length - 3]
                                  const userId = pathParts[pathParts.length - 2]
                                  const filename = pathParts[pathParts.length - 1]
                                  return `/uploads/${fileType}/${userId}/${filename}`
                                }
                                return ''
                              }
                              
                              const fileType = getFileType(attachment)
                              const attachmentUrl = getAttachmentUrl(attachment)
                              
                              if (fileType === 'image') {
                                return (
                                  <div className="relative w-8 h-8 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                    <img 
                                      src={attachmentUrl} 
                                      alt={attachment.name || attachment.original_filename}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to icon if image fails to load
                                        e.currentTarget.style.display = 'none'
                                        const next = e.currentTarget.nextElementSibling
                                        if (next instanceof HTMLElement) next.style.display = 'flex'
                                      }}
                                    />
                                    <div className="w-full h-full bg-green-50 flex items-center justify-center" style={{display: 'none'}}>
                                      <Image className="h-3 w-3 text-green-600" />
                                    </div>
                                  </div>
                                )
                              } else if (fileType === 'video') {
                                return <Video className="h-4 w-4 text-purple-600" />
                              } else {
                                return <FileText className="h-4 w-4 text-blue-600" />
                              }
                            })()}
                            <span className="text-sm text-gray-700">{attachment.name || attachment.original_filename}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(attachment.size ?? attachment.file_size ?? 0)})</span>
                            <button className="text-indigo-600 hover:text-indigo-800">
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created {formatDate(entry.createdAt)}</span>
                      {entry.updatedAt !== entry.createdAt && (
                        <span>Updated {formatDate(entry.updatedAt)}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleViewDetails(entry)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="journal-pagination">
          <div className="journal-pagination-content">
            <div className="journal-pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEntries.length)} of {filteredEntries.length} entries
            </div>
            
            <div className="journal-pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="journal-pagination-button"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="journal-pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`journal-pagination-page ${
                      currentPage === page ? 'active' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="journal-pagination-button"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entry Details Modal */}
      <JournalEntryDetails
        entry={selectedEntry}
        isOpen={showDetails}
        onClose={handleCloseDetails}
        onEdit={onEditEntry}
        onDelete={onDeleteEntry}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && entryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Journal Entry
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete <strong>"{entryToDelete.title}"</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

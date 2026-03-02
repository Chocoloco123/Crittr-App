'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Heart, 
  Pill, 
  Activity, 
  Stethoscope, 
  Scissors, 
  Weight, 
  PawPrint,
  Image,
  Video,
  Download,
  Edit,
  Trash2
} from 'lucide-react'
import { useNotify } from '@/components/providers/NotificationProvider'
import type { JournalEntry, Attachment } from '@/types/journal'

interface JournalEntryDetailsProps {
  entry: JournalEntry | null
  isOpen: boolean
  onClose: () => void
  onEdit: (entry: JournalEntry) => void
  onDelete: (entryId: string) => void
}

const entryTypeConfig = {
  general: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'General' },
  feeding: { icon: Heart, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Feeding' },
  medication: { icon: Pill, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Medication' },
  exercise: { icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Exercise' },
  vet_visit: { icon: Stethoscope, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Vet Visit' },
  grooming: { icon: Scissors, color: 'text-pink-600', bgColor: 'bg-pink-100', label: 'Grooming' },
  weight: { icon: Weight, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Weight' },
  symptoms: { icon: PawPrint, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Symptoms' }
}

export default function JournalEntryDetails({ entry, isOpen, onClose, onEdit, onDelete }: JournalEntryDetailsProps) {
  const { success, error } = useNotify()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  if (!entry) return null

  const typeConfig = entryTypeConfig[entry.entryType]
  const Icon = typeConfig.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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

  const buildAttachmentUrl = (attachment: any): string => {
    // Handle both mock data format and backend format
    if (attachment.url) {
      // Mock data format - use the url directly
      return attachment.url
    }
    
    // Backend format - build URL from file path
    if (attachment.file_path) {
      const pathParts = attachment.file_path.split('/')
      const fileType = pathParts[pathParts.length - 3] // e.g., 'images'
      const userId = pathParts[pathParts.length - 2] // user ID
      const filename = pathParts[pathParts.length - 1] // filename
      
      return `/uploads/${fileType}/${userId}/${filename}`
    }
    
    return ''
  }

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a')
    link.href = buildAttachmentUrl(attachment)
    // Handle both mock and backend formats for filename
    link.download = attachment.original_filename || attachment.name || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEdit = () => {
    onEdit(entry)
    onClose()
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete(entry.id)
    onClose()
    setShowDeleteConfirm(false)
    success(
      'Journal Entry Deleted! 🗑️',
      `"${entry.title}" has been deleted from ${entry.petName}'s journal`,
      4000
    )
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-6 py-4 border-b border-teal-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${typeConfig.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-teal-800">{entry.title}</h2>
                      <div className="flex items-center space-x-2 text-sm text-teal-600">
                        <span className={`px-2 py-1 ${typeConfig.bgColor} ${typeConfig.color} rounded-full text-xs font-medium`}>
                          {typeConfig.label}
                        </span>
                        <span>•</span>
                        <span>{entry.petName}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-teal-400 hover:text-teal-600 transition-colors p-2 rounded-full hover:bg-teal-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Entry Details */}
                <div className="space-y-6">
                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium text-gray-900">{formatDate(entry.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">{formatTime(entry.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Entry Details</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {entry.attachments && entry.attachments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                      <div className="space-y-4">
                        {entry.attachments.map((attachment) => {
                          // Debug: log the attachment data to see what we're working with
                          console.log('🔍 Attachment data:', attachment)
                          
                          // Determine file type from various sources
                          const getFileType = (att: any) => {
                            // Backend format
                            if (att.file_type) return att.file_type
                            if (att.mime_type) {
                              if (att.mime_type.startsWith('image/')) return 'image'
                              if (att.mime_type.startsWith('video/')) return 'video'
                              return 'document'
                            }
                            
                            // Mock data format
                            if (att.type) return att.type
                            
                            // Fallback based on file extension
                            const url = att.url || att.file_path || ''
                            if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image'
                            if (url.match(/\.(mp4|webm|ogg|avi|mov)$/i)) return 'video'
                            
                            return 'document' // fallback
                          }
                          
                          const fileType = getFileType(attachment)
                          
                          return (
                          <div key={attachment.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            {fileType === 'image' ? (
                              <div className="relative">
                                <img 
                                  src={buildAttachmentUrl(attachment)} 
                                  alt={attachment.original_filename || attachment.name}
                                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(buildAttachmentUrl(attachment), '_blank')}
                                  onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    e.currentTarget.style.display = 'none'
                                    const next = e.currentTarget.nextElementSibling
                                    if (next instanceof HTMLElement) next.style.display = 'flex'
                                  }}
                                />
                                <div className="w-full h-48 bg-blue-50 flex items-center justify-center" style={{display: 'none'}}>
                                  <div className="text-center">
                                    <Image className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm text-blue-600">Image failed to load</p>
                                  </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                  Click to view full size
                                </div>
                              </div>
                            ) : fileType === 'video' ? (
                              <div className="relative">
                                <video 
                                  src={buildAttachmentUrl(attachment)} 
                                  controls
                                  className="w-full h-48 object-cover rounded-lg"
                                  preload="metadata"
                                >
                                  Your browser does not support the video tag.
                                </video>
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                  Video
                                </div>
                              </div>
                            ) : (
                              <div className="h-32 bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                  <FileText className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">Document</p>
                                  <button
                                    onClick={() => window.open(buildAttachmentUrl(attachment), '_blank')}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                  >
                                    View Document
                                  </button>
                                </div>
                              </div>
                            )}
                            <div className="p-3 bg-white">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.original_filename || attachment.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(attachment.file_size ?? attachment.size ?? 0)}</p>
                                </div>
                                <button
                                  onClick={() => handleDownload(attachment)}
                                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Last Updated */}
                  {entry.updatedAt !== entry.createdAt && (
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-amber-700">Last Updated</p>
                        <p className="font-medium text-amber-800">{formatDate(entry.updatedAt)} at {formatTime(entry.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Entry ID: {entry.id}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
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
                      Are you sure you want to delete <strong>"{entry.title}"</strong>? 
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
        </>
      )}
    </AnimatePresence>
  )
}

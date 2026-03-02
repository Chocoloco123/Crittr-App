'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image, 
  Camera,
  Video,
  FileText,
  Save,
  X,
  Plus,
  Calendar,
  Clock,
  Heart,
  Activity,
  Pill,
  Weight,
  Stethoscope,
  Scissors,
  PawPrint
} from 'lucide-react'
import { useNotify } from '@/components/providers/NotificationProvider'
import type { JournalEntry, Attachment } from '@/types/journal'

interface JournalEditorProps {
  petId?: string
  petName?: string
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  initialData?: Partial<JournalEntry>
  onPetChange?: (petId: string, petName: string) => void
}

const entryTypes = [
  { value: 'general', label: 'General', icon: FileText, color: 'text-gray-600' },
  { value: 'feeding', label: 'Feeding', icon: Heart, color: 'text-green-600' },
  { value: 'medication', label: 'Medication', icon: Pill, color: 'text-red-600' },
  { value: 'exercise', label: 'Exercise', icon: Activity, color: 'text-blue-600' },
  { value: 'vet_visit', label: 'Vet Visit', icon: Stethoscope, color: 'text-purple-600' },
  { value: 'grooming', label: 'Grooming', icon: Scissors, color: 'text-pink-600' },
  { value: 'weight', label: 'Weight', icon: Weight, color: 'text-orange-600' },
  { value: 'symptoms', label: 'Symptoms', icon: PawPrint, color: 'text-yellow-600' }
]

export default function JournalEditor({ 
  petId, 
  petName, 
  onSave, 
  onCancel, 
  initialData,
  onPetChange 
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [entryType, setEntryType] = useState<JournalEntry['entryType']>(
    initialData?.entryType || 'general'
  )
  const [attachments, setAttachments] = useState<Attachment[]>(
    initialData?.attachments || []
  )
  const [isUploading, setIsUploading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState(petId || '')
  const [selectedPetName, setSelectedPetName] = useState(petName || '')
  const { error } = useNotify()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // Ensure initial data is loaded when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? '')
      setContent(initialData.content ?? '')
      setEntryType(initialData.entryType ?? 'general')
      setAttachments(initialData.attachments || [])
      if (editorRef.current) {
        editorRef.current.innerHTML = initialData.content ?? ''
      }
    }
  }, [initialData])

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.url && attachment.url.startsWith('blob:')) {
          URL.revokeObjectURL(attachment.url)
        }
      })
    }
  }, [attachments])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      error('Missing Information', 'Please fill in both title and content', 3000)
      return
    }

    if (!selectedPetId) {
      error('Pet Required', 'Please select a pet for this journal entry', 3000)
      return
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      petId: selectedPetId,
      petName: selectedPetName,
      entryType,
      attachments
    })
  }

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true)
    
    try {
      const newAttachments: Attachment[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'document'
        
        // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
        // For demo purposes, we'll use a placeholder image from our icons folder
        const mockUrl = fileType === 'image' ? '/images/icons/dog.png' : 
                       fileType === 'video' ? '/images/icons/cat.png' : 
                       '/images/icons/journal.png'
        
        newAttachments.push({
          id: `attachment-${Date.now()}-${i}`,
          type: fileType,
          url: mockUrl,
          name: file.name,
          size: file.size
        })
      }
      
      setAttachments(prev => [...prev, ...newAttachments])
    } catch (err) {
      console.error('Error uploading files:', err)
      error('Upload Failed', 'Error uploading files. Please try again.', 4000)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const removeAttachment = (attachmentId: string | number) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const insertText = (text: string) => {
    if (editorRef.current && typeof window !== 'undefined') {
      editorRef.current.focus()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(document.createTextNode(text))
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // If no selection, append to end
        editorRef.current.innerHTML += text
      }
      // Update content state
      setContent(editorRef.current.innerHTML)
    }
  }

  const toggleFormat = (command: string) => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false)
      editorRef.current?.focus()
      // Update content state after formatting
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
      }
    }
  }


  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setContent(target.innerHTML)
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-50 via-teal-100 to-orange-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-family: 'Poppins', sans-serif">📝 New Journal Entry</h2>
              {petName && (
                <p className="text-gray-600 mt-1 font-family: 'Inter', sans-serif">For {petName}</p>
              )}
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-white/50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Pet Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 font-family: 'Inter', sans-serif">
              Select Pet
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    onPetChange?.(pet.id, pet.name)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                    selectedPetId === pet.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-teal-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {pet.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-family: 'Poppins', sans-serif">{pet.name}</h4>
                      <p className="text-sm text-gray-600 font-family: 'Inter', sans-serif">{pet.breed}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Entry Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 font-family: 'Inter', sans-serif">
              Entry Type
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {entryTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setEntryType(type.value as JournalEntry['entryType'])}
                    className={`p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                      entryType === type.value
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-teal-300 bg-white'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-1 ${type.color}`} />
                    <span className="text-xs font-medium text-gray-700 font-family: 'Inter', sans-serif">
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-family: 'Inter', sans-serif">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter entry title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-family: 'Inter', sans-serif"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-family: 'Inter', sans-serif">
              Content
            </label>
            
            {/* Toolbar */}
            <div className="border border-gray-300 rounded-t-xl bg-gradient-to-r from-teal-50 to-orange-50 p-3 flex flex-wrap gap-2">
              <button
                onClick={() => toggleFormat('bold')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Bold"
              >
                <Bold className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => toggleFormat('italic')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Italic"
              >
                <Italic className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => toggleFormat('underline')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Underline"
              >
                <Underline className="h-4 w-4 text-gray-600" />
              </button>
              <div className="w-px h-8 bg-gray-300 mx-1" />
              <button
                onClick={() => insertText('📅 ')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Insert Date"
              >
                <Calendar className="h-4 w-4 text-teal-600" />
              </button>
              <button
                onClick={() => insertText('⏰ ')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Insert Time"
              >
                <Clock className="h-4 w-4 text-teal-600" />
              </button>
              <button
                onClick={() => insertText('❤️ ')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Insert Heart"
              >
                <Heart className="h-4 w-4 text-pink-500" />
              </button>
              <button
                onClick={() => insertText('🐾 ')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Insert Paw Print"
              >
                <PawPrint className="h-4 w-4 text-orange-500" />
              </button>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="border border-gray-300 border-t-0 rounded-b-xl p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-teal-500 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none font-family: 'Inter', sans-serif"
              data-placeholder="Write your journal entry here..."
              suppressContentEditableWarning={true}
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-family: 'Inter', sans-serif">
              Attachments
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gradient-to-r from-teal-50 to-orange-50">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    <Image className="h-4 w-4" />
                    <span>Add Images</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    <Video className="h-4 w-4" />
                    <span>Add Videos</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Add Documents</span>
                  </button>
                </div>
                
                {isUploading && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                    <span>Uploading files...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      {(() => {
                        // Handle both mock and backend attachment formats
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
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              <img 
                                src={attachmentUrl} 
                                alt={attachment.name ?? attachment.original_filename ?? ''}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to icon if image fails to load
                                  e.currentTarget.style.display = 'none'
                                  const next = e.currentTarget.nextElementSibling
                                  if (next instanceof HTMLElement) next.style.display = 'flex'
                                }}
                              />
                              <div className="w-full h-full bg-teal-50 flex items-center justify-center" style={{display: 'none'}}>
                                <Image className="h-5 w-5 text-teal-600" />
                              </div>
                            </div>
                          )
                        } else if (fileType === 'video') {
                          return (
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Video className="h-5 w-5 text-orange-600" />
                            </div>
                          )
                        } else {
                          return (
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                          )
                        }
                      })()}
                      <div>
                        <p className="font-medium text-gray-900 font-family: 'Inter', sans-serif">{attachment.name ?? attachment.original_filename ?? 'Attachment'}</p>
                        <p className="text-sm text-gray-500 font-family: 'Inter', sans-serif">{formatFileSize(attachment.size ?? attachment.file_size ?? 0)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-teal-50 to-orange-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-family: 'Inter', sans-serif"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg font-family: 'Inter', sans-serif"
          >
            <Save className="h-4 w-4" />
            <span>Save Entry</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

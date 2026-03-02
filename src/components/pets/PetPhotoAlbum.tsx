'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  X, 
  Download, 
  Calendar, 
  Image as ImageIcon,
  Plus,
  Camera,
  Heart,
  Share2
} from 'lucide-react'

interface Photo {
  id: string
  url: string
  filename: string
  uploadedAt: string
  source: 'journal' | 'upload' // Whether it came from a journal entry or direct upload
  journalEntryId?: string // If from journal, which entry
  journalEntryTitle?: string // Title of the journal entry
}

interface PetPhotoAlbumProps {
  petId: string
  petName: string
  isOpen: boolean
  onClose: () => void
  isDemo?: boolean
}

export default function PetPhotoAlbum({ petId, petName, isOpen, onClose, isDemo = false }: PetPhotoAlbumProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isSharing, setIsSharing] = useState(false)

  // Load photos from journal entries and direct uploads
  useEffect(() => {
    if (isOpen) {
      loadPhotos()
    }
  }, [isOpen, petId, isDemo])

  const loadPhotos = async () => {
    setLoading(true)
    try {
      if (isDemo) {
        // Load demo photos from journal entries
        const demoPhotos = await loadDemoPhotos()
        setPhotos(demoPhotos)
      } else {
        // Load real photos from backend
        const realPhotos = await loadRealPhotos()
        setPhotos(realPhotos)
      }
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDemoPhotos = async (): Promise<Photo[]> => {
    // Get journal entries from local storage
    const journalEntries = JSON.parse(localStorage.getItem('journal-entries') || '[]')
    
    const photos: Photo[] = []
    
    // Extract image attachments from journal entries for this pet
    journalEntries.forEach((entry: any) => {
      if (entry.petId === petId && entry.attachments) {
        entry.attachments.forEach((attachment: any) => {
          if (attachment.type === 'image') {
            photos.push({
              id: `demo-${entry.id}-${attachment.id}`,
              url: attachment.url,
              filename: attachment.name,
              uploadedAt: entry.createdAt,
              source: 'journal',
              journalEntryId: entry.id,
              journalEntryTitle: entry.title
            })
          }
        })
      }
    })
    
    // Add some demo photos from the icons folder
    const demoIcons = [
      { name: 'dog.png', title: 'Pet Portrait' },
      { name: 'cat.png', title: 'Sleeping Cat' },
      { name: 'goldenretriever.png', title: 'Golden Retriever' },
      { name: 'paw.png', title: 'Paw Print' },
      { name: 'stethescope.png', title: 'Vet Visit' },
      { name: 'heart-red.png', title: 'Love' }
    ]
    
    // Test image removed - images are loading correctly
    
    demoIcons.forEach((icon, index) => {
      photos.push({
        id: `demo-icon-${index}`,
        url: `/images/icons/${icon.name}`,
        filename: icon.title,
        uploadedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
        source: 'upload'
      })
    })
    
    return photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  const loadRealPhotos = async (): Promise<Photo[]> => {
    // TODO: Implement real photo loading from backend
    // This would fetch photos from the journal_attachments table
    // and any direct photo uploads
    return []
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a')
    link.href = photo.url
    link.download = photo.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async (photo: Photo) => {
    // Prevent multiple concurrent share operations
    if (isSharing) {
      return // Silently ignore if already sharing
    }

    setIsSharing(true)
    
    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${petName}'s Photo`,
            text: `Check out this photo of ${petName}!`,
            url: photo.url
          })
          // Share was successful - no need to do anything else
        } catch (error) {
          // Handle the case where user cancels the share dialog
          if (error instanceof Error && error.name === 'AbortError') {
            // User cancelled the share - this is expected behavior, no need to show error
            console.log('Share cancelled by user')
            return
          }
          // Handle other errors
          console.error('Error sharing photo:', error)
          // Fallback to clipboard if share fails for other reasons
          try {
            await navigator.clipboard.writeText(photo.url)
            // You could show a toast notification here for successful clipboard copy
          } catch (clipboardError) {
            console.error('Failed to copy to clipboard:', clipboardError)
          }
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(photo.url)
          // You could show a toast notification here
        } catch (error) {
          console.error('Failed to copy to clipboard:', error)
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleShare:', error)
    } finally {
      // Always reset the sharing state
      setIsSharing(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{petName}'s Photo Album</h2>
                <p className="text-gray-600 mt-1">{photos.length} photos</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <span className="ml-3 text-gray-600">Loading photos...</span>
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
                  <p className="text-gray-600">Start adding photos to your journal entries to see them here!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative border border-gray-200">
                        <Image
                          src={photo.url}
                          alt={photo.filename}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          style={{ backgroundColor: 'transparent' }}
                          priority={true}
                          quality={75}
                          onLoadingComplete={() => {
                            console.log('Image loaded, adding to loaded set:', photo.id)
                            setLoadedImages(prev => new Set(prev).add(photo.id))
                          }}
                          onError={(e) => {
                            console.error('Image failed to load:', photo.url)
                            const imgElement = e.target as HTMLImageElement
                            if (imgElement.parentElement) {
                              imgElement.style.display = 'none'
                              const nextElement = imgElement.nextElementSibling
                              if (nextElement) {
                                (nextElement as HTMLElement).style.display = 'flex'
                              }
                            }
                          }}
                        />
                        {/* Loading indicator */}
                        {!loadedImages.has(photo.id) && (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center absolute inset-0">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-2"></div>
                              <p className="text-xs text-gray-500">Loading...</p>
                              <p className="text-xs text-gray-400">ID: {photo.id}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Error fallback */}
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Failed to load</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(photo)
                            }}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          >
                            <Download className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare(photo)
                            }}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                      </div>

                      {/* Source indicator */}
                      {photo.source === 'journal' && (
                        <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                          Journal
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Photo Detail Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-60 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl max-h-[80vh] bg-white rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image container */}
                <div className="relative bg-white p-4">
                  <Image
                    src={selectedPhoto.url}
                    alt={selectedPhoto.filename}
                    width={800}
                    height={800}
                    className="max-w-full max-h-[60vh] object-contain mx-auto"
                    priority={true}
                    quality={85}
                  />
                </div>
                
                {/* Photo info */}
                <div className="bg-white border-t border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedPhoto.filename}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedPhoto.uploadedAt)}
                        {selectedPhoto.journalEntryTitle && (
                          <span> • From: {selectedPhoto.journalEntryTitle}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(selectedPhoto)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShare(selectedPhoto)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
                        title="Share"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 shadow-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

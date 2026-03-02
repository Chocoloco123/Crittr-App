'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Edit,
  Heart,
  Calendar,
  Tag
} from 'lucide-react'
import Link from 'next/link'
import AppNavigation from '@/components/layout/AppNavigation'

interface Photo {
  id: string
  filename: string
  original_filename: string
  file_path: string
  mime_type: string
  file_size: number
  caption?: string
  tags?: string[]
  created_at: string
}

interface Album {
  id: string
  name: string
  description?: string
  cover_photo_id?: string
  pet_id: string
  user_id: string
  is_public: boolean
  created_at: string
  updated_at: string
  photos: Photo[]
  photo_count: number
}

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [album, setAlbum] = useState<Album | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockAlbum: Album = {
      id: '1',
      name: 'Buddy\'s Adventures',
      description: 'All the fun times with Buddy',
      cover_photo_id: '1',
      pet_id: '1',
      user_id: 'demo',
      is_public: false,
      created_at: '2024-01-15T08:30:00Z',
      updated_at: '2024-01-15T08:30:00Z',
      photos: [
        {
          id: '1',
          filename: 'dog.png',
          original_filename: 'buddy_park.jpg',
          file_path: '/images/icons/dog.png',
          mime_type: 'image/png',
          file_size: 2048000,
          caption: 'Buddy at the park',
          tags: ['park', 'fun', 'outdoor'],
          created_at: '2024-01-15T08:30:00Z'
        },
        {
          id: '2',
          filename: 'goldenretriever.png',
          original_filename: 'buddy_sleeping.jpg',
          file_path: '/images/icons/goldenretriever.png',
          mime_type: 'image/png',
          file_size: 2048000,
          caption: 'Buddy taking a nap',
          tags: ['sleep', 'cute', 'indoor'],
          created_at: '2024-01-14T15:20:00Z'
        }
      ],
      photo_count: 2
    }

    setAlbum(mockAlbum)
    setLoading(false)
  }, [params.albumId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Album not found</h2>
          <p className="text-gray-600 mb-4">The album you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard/albums"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Back to Albums
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {/* Image Container */}
            <div className="relative h-[60vh] flex items-center justify-center bg-gray-50 p-4">
              <Image
                src={selectedPhoto.file_path}
                alt={selectedPhoto.caption || selectedPhoto.filename}
                width={600}
                height={400}
                className="max-w-full max-h-full object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 50vw"
                priority
                quality={75}
              />
            </div>
            
            {/* Photo Info */}
            <div className="p-4 bg-white border-t border-gray-200">
              {selectedPhoto.caption && (
                <p className="text-lg font-medium text-gray-900 mb-2">{selectedPhoto.caption}</p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{formatDate(selectedPhoto.created_at)}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = selectedPhoto.file_path
                      link.download = selectedPhoto.filename
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Download"
                  >
                    <Download className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={async () => {
                      // Prevent multiple concurrent share operations
                      if (isSharing) {
                        return // Silently ignore if already sharing
                      }

                      setIsSharing(true)
                      
                      try {
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: selectedPhoto.caption || 'Shared Photo',
                              url: selectedPhoto.file_path
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
                              await navigator.clipboard.writeText(selectedPhoto.file_path)
                            } catch (clipboardError) {
                              console.error('Failed to copy to clipboard:', clipboardError)
                            }
                          }
                        } else {
                          // Fallback: copy to clipboard
                          try {
                            await navigator.clipboard.writeText(selectedPhoto.file_path)
                          } catch (error) {
                            console.error('Failed to copy to clipboard:', error)
                          }
                        }
                      } catch (error) {
                        console.error('Unexpected error in share handler:', error)
                      } finally {
                        // Always reset the sharing state
                        setIsSharing(false)
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <AppNavigation currentPage="Album" />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/dashboard/albums"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Albums
              </Link>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                {album.description && (
                  <p className="text-gray-600 mt-2">{album.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(album.created_at)}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {album.photo_count} photos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {album.photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={photo.file_path}
                    alt={photo.caption || photo.filename}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-200" />
                  
                  {/* Actions */}
                  <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle download
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle share
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-4">
                  {photo.caption && (
                    <p className="font-medium text-gray-900 mb-1">{photo.caption}</p>
                  )}
                  <p className="text-sm text-gray-500">{formatDate(photo.created_at)}</p>
                  
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {photo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
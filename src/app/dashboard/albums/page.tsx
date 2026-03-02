'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Camera, 
  Grid3X3, 
  List, 
  Search,
  Eye,
  Trash2
} from 'lucide-react'
import AppNavigation from '@/components/layout/AppNavigation'
import { useNotify } from '@/components/providers/NotificationProvider'
import './page.scss'

interface Photo {
  id: string
  filename: string
  original_filename: string
  file_path: string
  mime_type: string
  file_size: number
  width?: number
  height?: number
  caption?: string
  tags?: string[]
  created_at: string
}

interface PhotoAlbum {
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

export default function PhotoAlbumsPage() {
  const router = useRouter()
  const { success } = useNotify()
  const [mounted, setMounted] = useState(false)
  const [albums, setAlbums] = useState<PhotoAlbum[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPet, setSelectedPet] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'photos'>('date')
  const [_showCreateAlbum, setShowCreateAlbum] = useState(false)

  // Demo pets data
  const demoPets = [
    { id: '1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', avatar: '🐕' },
    { id: '2', name: 'Luna', type: 'Cat', breed: 'Maine Coon', avatar: '🐱' },
    { id: '3', name: 'Max', type: 'Dog', breed: 'Labrador', avatar: '🐕' }
  ]

  // Demo photo albums
  const mockAlbums: PhotoAlbum[] = [
    {
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
    },
    {
      id: '2',
      name: 'Luna\'s Cute Moments',
      description: 'Luna being adorable',
      cover_photo_id: '3',
      pet_id: '2',
      user_id: 'demo',
      is_public: false,
      created_at: '2024-01-14T10:15:00Z',
      updated_at: '2024-01-14T10:15:00Z',
      photos: [
        {
          id: '3',
          filename: 'cat.png',
          original_filename: 'luna_window.jpg',
          file_path: '/images/icons/cat.png',
          mime_type: 'image/png',
          file_size: 2048000,
          caption: 'Luna watching birds',
          tags: ['window', 'birds', 'cute'],
          created_at: '2024-01-14T10:15:00Z'
        },
        {
          id: '4',
          filename: 'paw.png',
          original_filename: 'luna_paw.jpg',
          file_path: '/images/icons/paw.png',
          mime_type: 'image/png',
          file_size: 2048000,
          caption: 'Luna\'s cute paw',
          tags: ['paw', 'cute', 'close-up'],
          created_at: '2024-01-13T16:45:00Z'
        }
      ],
      photo_count: 2
    }
  ]

  useEffect(() => {
    setMounted(true)
    // In a real app, this would fetch from the backend
    setAlbums(mockAlbums)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mockAlbums is static demo data
  }, [])

  const handleCreateAlbum = () => {
    setShowCreateAlbum(true)
  }

  const handleViewAlbum = (album: PhotoAlbum) => {
    router.push(`/dashboard/albums/${album.id}`)
  }


  const handleDeleteAlbum = (albumId: string) => {
    setAlbums(albums.filter(album => album.id !== albumId))
    success('Album Deleted', 'Photo album has been deleted successfully')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const _formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getPetName = (petId: string) => {
    const pet = demoPets.find(p => p.id === petId)
    return pet ? pet.name : 'Unknown Pet'
  }

  const filteredAlbums = albums
    .filter(album => {
      const matchesSearch = album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           album.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPet = selectedPet === 'all' || album.pet_id === selectedPet
      return matchesSearch && matchesPet
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'photos':
          return b.photo_count - a.photo_count
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation currentPage="Albums" />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Photo Albums</h1>
                <p className="text-gray-600 mt-2">Organize and view your pet photos</p>
              </div>
              <button
                onClick={handleCreateAlbum}
                className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>New Album</span>
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search albums by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <select
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Pets</option>
                  {demoPets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'photos')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="photos">Sort by Photos</option>
                </select>
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Grid view"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Results Summary */}
            {filteredAlbums.length !== albums.length && (
              <div className="text-sm text-gray-600">
                Showing {filteredAlbums.length} of {albums.length} albums
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedPet !== 'all' && ` for ${getPetName(selectedPet)}`}
              </div>
            )}
          </div>

          {/* Albums Grid/List */}
          {filteredAlbums.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No albums found</h3>
              <p className="text-gray-600 mb-4">Create your first photo album to get started</p>
              <button
                onClick={handleCreateAlbum}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Create Album
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredAlbums.map((album) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => handleViewAlbum(album)}
                >
                  {/* Cover Photo */}
                  <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'} relative overflow-hidden bg-gray-100`}>
                    {album.cover_photo_id ? (
                      <Image
                        src={album.photos.find(p => p.id === album.cover_photo_id)?.file_path || '/images/icons/dog.png'}
                        alt={album.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm border border-white/20">
                      {album.photo_count} photos
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{album.name}</h3>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewAlbum(album)
                          }}
                          className="text-teal-600 hover:text-teal-800 p-1 rounded hover:bg-teal-50 transition-colors"
                          title="View album"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAlbum(album.id)
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete album"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {album.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{album.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{getPetName(album.pet_id)}</span>
                      <span>{formatDate(album.created_at)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

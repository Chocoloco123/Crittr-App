'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  User, 
  Trash2, 
  AlertTriangle, 
  LogOut,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import AppNavigation from '@/components/layout/AppNavigation'
import './page.scss'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Account deleted successfully, sign out and redirect
        await signOut({ callbackUrl: '/' })
      } else {
        const error = await response.json()
        alert(`Failed to delete account: ${error.detail || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  // Check if user is not authenticated or is a demo user
  const isDemoUser = session?.user?.email?.includes('demo') || !session?.user?.email
  
  if (!session || isDemoUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {!session ? 'You need to be signed in to access settings.' : 'Demo users cannot access account settings.'}
          </p>
          <Link href="/auth/signin" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <AppNavigation currentPage="settings" />
      
      <div className="settings-container">
        {/* Back to Dashboard Button */}
        <div className="settings-back-button">
          <Link 
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Settings Header */}
        <div className="settings-header">
          <h1 className="settings-title">⚙️ Settings</h1>
          <p className="settings-subtitle">Manage your account and preferences</p>
        </div>

        <div className="settings-content">
          {/* Account Information */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="settings-section"
            >
              <div className="settings-section-header">
                <div className="settings-section-icon bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="settings-section-title">Account Information</h2>
              </div>

              <div className="settings-section-content">
                <div className="settings-field">
                  <label className="settings-field-label">Email</label>
                  <p className="settings-field-value">{session.user?.email}</p>
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Name</label>
                  <p className="settings-field-value">{session.user?.name || 'Not provided'}</p>
                </div>
                <div className="settings-field">
                  <label className="settings-field-label">Account Type</label>
                  <p className="settings-field-value">Standard User</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            {/* Sign Out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="settings-section"
            >
              <div className="settings-section-header">
                <div className="settings-section-icon bg-gray-100">
                  <LogOut className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="settings-section-title">Sign Out</h3>
              </div>
              <div className="settings-section-content">
                <p className="text-gray-600 mb-4">Sign out of your account on this device.</p>
                <button
                  onClick={handleSignOut}
                  className="settings-button secondary w-full"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>

            {/* Danger Zone - Only show for non-demo users */}
            {session?.user?.email !== 'demo@crittr.app' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="settings-section settings-danger-zone"
              >
                <div className="settings-section-header">
                  <div className="settings-section-icon settings-danger-icon">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="settings-section-title settings-danger-title">Danger Zone</h3>
                </div>
                <div className="settings-section-content">
                  <p className="text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="settings-button danger w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="settings-modal">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="settings-modal-backdrop" onClick={() => setShowDeleteModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="settings-modal-content"
            >
              <div className="settings-modal-header">
                <div className="settings-section-icon bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="settings-modal-title">Delete Account</h3>
              </div>
              
              <div className="settings-modal-body">
                <p className="settings-modal-description">
                  This will permanently delete your account and all associated data including:
                </p>
                <ul className="settings-modal-list">
                  <li>• All pet profiles and photos</li>
                  <li>• Journal entries and quick logs</li>
                  <li>• Reminders and notifications</li>
                  <li>• All other account data</li>
                </ul>
                <p className="settings-modal-warning">
                  This action cannot be undone.
                </p>
              </div>

              <div className="settings-modal-field">
                <label className="settings-modal-label">
                  Type &quot;DELETE&quot; to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="settings-modal-input"
                  placeholder="DELETE"
                />
              </div>

              <div className="settings-modal-actions">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="settings-modal-button cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                  className="settings-modal-button danger"
                >
                  {isDeleting ? (
                    <>
                      <div className="settings-loading-spinner"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

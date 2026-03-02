'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import OneTapLogging from '@/components/logging/OneTapLogging'
import AppNavigation from '@/components/layout/AppNavigation'
import { useDemoStorageArray } from '@/lib/hooks/useDemoStorage'
import { useNotify } from '@/components/providers/NotificationProvider'
import './page.scss'

interface QuickLog {
  id: string
  petId: string
  petName: string
  activityType: string
  timestamp: string
  notes?: string
  attachments?: string[]
}

export default function QuickLogPage() {
  const { status } = useSession()
  const [mounted, setMounted] = useState(false)
  const { success } = useNotify()
  
  // Use optimized demo storage hook
  const { data: logs, addItem: addLog, updateItem: updateLog, removeItem: removeLog } = useDemoStorageArray<QuickLog>('quick-logs')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogActivity = (logData: Omit<QuickLog, 'id'>) => {
    const newLog: QuickLog = {
      ...logData,
      id: `log-${Date.now()}`
    }
    
    addLog(newLog)
    
    // Show success notification
    const activityName = logData.activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    success(
      'Activity Logged!',
      `${activityName} logged successfully for ${logData.petName}`,
      4000
    )
  }

  const handleEditLog = (logId: string, updatedLog: Omit<QuickLog, 'id'>) => {
    updateLog(logId, updatedLog)
    success('Log Updated!', 'Activity log updated successfully', 3000)
  }

  const handleDeleteLog = (logId: string) => {
    removeLog(logId)
    success('Log Deleted!', 'Activity log deleted successfully', 3000)
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-secondary">Loading quick log...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quick-log-page">
      {/* Header */}
      <AppNavigation currentPage="Quick Log" />

      <main className="quick-log-container">
        {/* Quick Log Header */}
        <div className="quick-log-header">
          <h1 className="quick-log-title">⚡ Quick Log</h1>
          <p className="quick-log-subtitle">Log activities instantly with one tap</p>
        </div>

        {/* One-Tap Logging Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="quick-log-content"
        >
          <OneTapLogging
            logs={logs}
            onLogActivity={handleLogActivity}
            onEditLog={handleEditLog}
            onDeleteLog={handleDeleteLog}
          />
        </motion.div>

        {/* Today's Summary */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="quick-log-summary"
          >
            <div className="quick-log-summary-header">
              <h3 className="quick-log-summary-title">Today&apos;s Activity Summary</h3>
            </div>
            <div className="quick-log-summary-content">
              <div className="quick-log-summary-grid">
                {logs.slice(0, 6).map((log) => (
                  <div key={log.id} className="quick-log-summary-item">
                    <div className="quick-log-summary-item-header">
                      <span className="quick-log-summary-item-activity">
                        {log.activityType.replace('_', ' ')}
                      </span>
                      <span className="quick-log-summary-item-time">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="quick-log-summary-item-pet">{log.petName}</p>
                    {log.notes && (
                      <p className="quick-log-summary-item-notes">&quot;{log.notes}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

/**
 * Demo Storage Utility - SSR Friendly
 * Handles localStorage with 30-minute expiration for demo users
 * Optimized for SEO and performance
 */

const DEMO_STORAGE_PREFIX = 'crittr-demo-'
const EXPIRATION_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds

interface StoredData<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// Cache for SSR to prevent hydration mismatches (stores StoredData shape per key)
const ssrCache = new Map<string, StoredData<unknown>>()

export class DemoStorage {
  /**
   * Check if we're in demo mode (SSR safe)
   */
  static isDemoMode(): boolean {
    // During SSR, assume demo mode for better SEO
    if (typeof window === 'undefined') return true
    
    // Check if there's a session in localStorage or if we're not authenticated
    try {
      const session = localStorage.getItem('next-auth.session-token')
      return !session
    } catch {
      return true
    }
  }

  /**
   * Store data with 30-minute expiration (SSR safe)
   */
  static setItem<T>(key: string, data: T): void {
    if (!this.isDemoMode()) return

    const now = Date.now()
    const storedData: StoredData<T> = {
      data,
      timestamp: now,
      expiresAt: now + EXPIRATION_TIME
    }

    // Store in SSR cache for immediate access
    ssrCache.set(key, storedData)

    // Store in localStorage if available
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${DEMO_STORAGE_PREFIX}${key}`, JSON.stringify(storedData))
      } catch (error) {
        console.error('Error storing demo data:', error)
      }
    }
  }

  /**
   * Retrieve data if not expired (SSR safe)
   */
  static getItem<T>(key: string): T | null {
    if (!this.isDemoMode()) return null

    // Check SSR cache first
    const cached = ssrCache.get(key)
    if (cached) {
      const now = Date.now()
      if (now <= cached.expiresAt) {
        return cached.data as T
      } else {
        ssrCache.delete(key)
      }
    }

    // Check localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${DEMO_STORAGE_PREFIX}${key}`)
        if (!stored) return null

        const storedData: StoredData<T> = JSON.parse(stored)
        const now = Date.now()

        // Check if data has expired
        if (now > storedData.expiresAt) {
          this.removeItem(key)
          return null
        }

        // Update SSR cache
        ssrCache.set(key, storedData)
        return storedData.data
      } catch (error) {
        console.error('Error retrieving demo data:', error)
        this.removeItem(key)
        return null
      }
    }

    return null
  }

  /**
   * Remove specific item
   */
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(`${DEMO_STORAGE_PREFIX}${key}`)
    } catch (error) {
      console.error('Error removing demo data:', error)
    }
  }

  /**
   * Clear all demo data
   */
  static clearAll(): void {
    if (typeof window === 'undefined') return

    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(DEMO_STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing demo data:', error)
    }
  }

  /**
   * Get all demo data keys
   */
  static getAllKeys(): string[] {
    if (typeof window === 'undefined') return []

    try {
      const keys = Object.keys(localStorage)
      return keys
        .filter(key => key.startsWith(DEMO_STORAGE_PREFIX))
        .map(key => key.replace(DEMO_STORAGE_PREFIX, ''))
    } catch (error) {
      console.error('Error getting demo data keys:', error)
      return []
    }
  }

  /**
   * Check if data exists and is not expired
   */
  static hasItem(key: string): boolean {
    return this.getItem(key) !== null
  }

  /**
   * Get time remaining until expiration (in minutes)
   */
  static getTimeRemaining(key: string): number {
    if (typeof window === 'undefined' || !this.isDemoMode()) return 0

    try {
      const stored = localStorage.getItem(`${DEMO_STORAGE_PREFIX}${key}`)
      if (!stored) return 0

      const storedData: StoredData<Record<string, unknown>> = JSON.parse(stored)
      const now = Date.now()
      const remaining = storedData.expiresAt - now

      return remaining > 0 ? Math.ceil(remaining / (60 * 1000)) : 0
    } catch (error) {
      console.error('Error getting time remaining:', error)
      return 0
    }
  }
}

// Auto-cleanup expired data on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const keys = DemoStorage.getAllKeys()
    keys.forEach(key => {
      // This will automatically remove expired data
      DemoStorage.getItem(key)
    })
  })
}

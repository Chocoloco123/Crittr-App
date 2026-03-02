/**
 * Custom hook for demo storage with SSR optimization
 * Prevents hydration mismatches and improves performance
 */

import { useState, useEffect, useCallback } from 'react'
import { DemoStorage } from '../demoStorage'

export function useDemoStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize data on mount (SSR safe)
  useEffect(() => {
    const savedData = DemoStorage.getItem<T>(key)
    if (savedData !== null) {
      setData(savedData)
    }
    setIsHydrated(true)
  }, [key])

  // Save data when it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      DemoStorage.setItem(key, data)
    }
  }, [data, key, isHydrated])

  // Optimized setter that batches updates
  const setDataOptimized = useCallback((newData: T | ((prev: T) => T)) => {
    setData(prev => {
      const updated = typeof newData === 'function' ? (newData as (prev: T) => T)(prev) : newData
      return updated
    })
  }, [])

  return [data, setDataOptimized, isHydrated] as const
}

/**
 * Hook for demo storage arrays with optimized operations
 */
export function useDemoStorageArray<T>(key: string, defaultValue: T[] = []) {
  const [data, setData, isHydrated] = useDemoStorage(key, defaultValue)

  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, item])
  }, [setData])

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setData(prev => prev.map(item => 
      (item as unknown as { id: string }).id === id ? { ...item, ...updates } : item
    ))
  }, [setData])

  const removeItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => (item as unknown as { id: string }).id !== id))
  }, [setData])

  const clearAll = useCallback(() => {
    setData([])
  }, [setData])

  return {
    data,
    addItem,
    updateItem,
    removeItem,
    clearAll,
    isHydrated
  }
}

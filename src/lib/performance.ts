// Performance monitoring utilities
'use client'

import { useEffect } from 'react'

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
      // Monitor Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            // Send to analytics service
            if (entry.startTime > 2500) {
              // LCP is slow - could send to analytics service
            }
          }
        }
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as { processingStart?: number; startTime?: number }
          if (fidEntry.processingStart && fidEntry.startTime) {
            // FID measured - could send to analytics service
            // Send to analytics service
          }
        }
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })
      
      // Monitor Cumulative Layout Shift (CLS)
      let _clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as { hadRecentInput?: boolean; value?: number }
          if (!clsEntry.hadRecentInput && typeof clsEntry.value === 'number') {
            _clsValue += clsEntry.value
          }
        }
        // CLS measured - could send to analytics service
        // Send to analytics service
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      
      return () => {
        observer.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
      } catch (_error) {
      }
    }
  }, [])
}

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload critical images
    const imageLink = document.createElement('link')
    imageLink.rel = 'preload'
    imageLink.href = '/images/icons/catdog.png'
    imageLink.as = 'image'
    document.head.appendChild(imageLink)
  }
}

// Resource hints for better performance
export const addResourceHints = () => {
  if (typeof window !== 'undefined') {
    // DNS prefetch for external domains
    const dnsPrefetch = document.createElement('link')
    dnsPrefetch.rel = 'dns-prefetch'
    dnsPrefetch.href = '//fonts.googleapis.com'
    document.head.appendChild(dnsPrefetch)
    
    // Preconnect to critical origins
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = 'https://fonts.gstatic.com'
    preconnect.crossOrigin = 'anonymous'
    document.head.appendChild(preconnect)
  }
}

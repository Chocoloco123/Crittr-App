// Optimized icon component to reduce bundle size
import { LucideIcon } from 'lucide-react'

interface IconProps {
  name: string
  size?: number
  className?: string
}

// Lazy load icons to reduce initial bundle size
const iconMap: Record<string, () => Promise<{ default: LucideIcon }>> = {
  'book-open': () => import('lucide-react').then(m => ({ default: m.BookOpen })),
  'camera': () => import('lucide-react').then(m => ({ default: m.Camera })),
  'bell': () => import('lucide-react').then(m => ({ default: m.Bell })),
  'share-2': () => import('lucide-react').then(m => ({ default: m.Share2 })),
  'bar-chart-3': () => import('lucide-react').then(m => ({ default: m.BarChart3 })),
  'zap': () => import('lucide-react').then(m => ({ default: m.Zap })),
  'search': () => import('lucide-react').then(m => ({ default: m.Search })),
  'users': () => import('lucide-react').then(m => ({ default: m.Users })),
  'calendar': () => import('lucide-react').then(m => ({ default: m.Calendar })),
  'heart': () => import('lucide-react').then(m => ({ default: m.Heart })),
  'pill': () => import('lucide-react').then(m => ({ default: m.Pill })),
  'weight': () => import('lucide-react').then(m => ({ default: m.Weight })),
  'phone': () => import('lucide-react').then(m => ({ default: m.Phone })),
  'monitor': () => import('lucide-react').then(m => ({ default: m.Monitor })),
  'star': () => import('lucide-react').then(m => ({ default: m.Star })),
  'sparkles': () => import('lucide-react').then(m => ({ default: m.Sparkles })),
  'shield': () => import('lucide-react').then(m => ({ default: m.Shield })),
  'arrow-right': () => import('lucide-react').then(m => ({ default: m.ArrowRight })),
  'paw-print': () => import('lucide-react').then(m => ({ default: m.PawPrint })),
  'play': () => import('lucide-react').then(m => ({ default: m.Play })),
  'user': () => import('lucide-react').then(m => ({ default: m.User })),
  'log-in': () => import('lucide-react').then(m => ({ default: m.LogIn })),
  'log-out': () => import('lucide-react').then(m => ({ default: m.LogOut })),
  'menu': () => import('lucide-react').then(m => ({ default: m.Menu })),
  'x': () => import('lucide-react').then(m => ({ default: m.X })),
  'loader-2': () => import('lucide-react').then(m => ({ default: m.Loader2 })),
}

import { useState, useEffect } from 'react'

export default function Icon({ name, size = 24, className = '' }: IconProps) {
  const [IconComponent, setIconComponent] = useState<LucideIcon | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const iconLoader = iconMap[name]
        if (iconLoader) {
          const { default: Icon } = await iconLoader()
          setIconComponent(() => Icon)
        }
      } catch (_error) {
        console.warn(`Failed to load icon: ${name}`)
      } finally {
        setLoading(false)
      }
    }

    loadIcon()
  }, [name])

  if (loading) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width: size, height: size }} />
  }

  if (!IconComponent) {
    return <div className={`bg-gray-300 rounded ${className}`} style={{ width: size, height: size }} />
  }

  return <IconComponent size={size} className={className} />
}

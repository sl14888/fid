'use client'

import { useState, useEffect } from 'react'
import type { ToastPosition } from 'react-hot-toast'
import type { ToastConfig } from './Toast.types'

const MOBILE_BREAKPOINT = 768

export const useToastConfig = (): ToastConfig => {
  const [position, setPosition] = useState<ToastPosition>('top-right')

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      setPosition(isMobile ? 'top-center' : 'top-right')
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    position,
    duration: 4000,
    style: {
      background: '#fff',
      color: '#363636',
      borderRadius: '8px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
    warning: {
      duration: 4000,
      iconTheme: {
        primary: '#f59e0b',
        secondary: '#fff',
      },
    },
    info: {
      duration: 3000,
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#fff',
      },
    },
    loading: {
      duration: Infinity,
      iconTheme: {
        primary: '#6b7280',
        secondary: '#fff',
      },
    },
  }
}

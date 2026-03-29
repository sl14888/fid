'use client'

import { useState, useEffect } from 'react'
import type { ToastPosition } from 'react-hot-toast'
import type { ToastConfig } from './Toast.types'

const MOBILE_BREAKPOINT = 768

export const useToastConfig = (): ToastConfig => {
  const [position, setPosition] = useState<ToastPosition>('top-right')
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      setPosition(isMobile ? 'top-center' : 'top-right')

      // Отступ сверху = padding хедера + высота хедера + дополнительный отступ
      const headerPaddingTop = isMobile ? 16 : 24
      const headerHeight = 60
      const additionalOffset = 8
      const topOffset = headerPaddingTop + headerHeight + additionalOffset

      setContainerStyle({
        top: `${topOffset}px`,
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    position,
    containerStyle,
    duration: 4000,
    style: {
      position: 'relative' as const,
      width: '300px',
      background: '#fff',
      color: '#000',
      borderRadius: '12px',
      boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.05)',
      padding: '12px 24px 12px 12px',
      fontSize: '14px',
      fontWeight: '500',
      alignItems: 'flex-start',
      gap: '8px',
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

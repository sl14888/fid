'use client'

import { Toaster } from 'react-hot-toast'
import { useToastConfig } from './useToastConfig'
import { useToastLimit } from '@/lib/utils/toast-utils'
import type { ToastProps } from './Toast.types'

export const Toast = ({ className }: ToastProps) => {
  const config = useToastConfig()

  useToastLimit()

  return (
    <Toaster
      position={config.position}
      toastOptions={{
        duration: config.duration,
        style: config.style,
        success: config.success,
        error: config.error,
        className: className,
      }}
    />
  )
}

'use client'

import toast, { Toaster, ToastBar } from 'react-hot-toast'
import { useToastConfig } from './useToastConfig'
import { useToastLimit } from '@/lib/utils/toast-utils'
import type { ToastProps } from './Toast.types'

const ErrorIcon = () => (
  <div style={{ width: 24, height: 24, flexShrink: 0, position: 'relative' }}>
    <div
      style={{
        width: 18,
        height: 18,
        left: 3,
        top: 3,
        position: 'absolute',
        borderRadius: 9999,
        border: '2px solid #FF4000',
        boxSizing: 'border-box',
      }}
    />
    <div
      style={{
        width: 2,
        height: 6,
        left: 11,
        top: 7,
        position: 'absolute',
        background: '#FF4000',
        borderRadius: 1,
      }}
    />
    <div
      style={{
        width: 2,
        height: 2,
        left: 11,
        top: 15,
        position: 'absolute',
        background: '#FF4000',
        borderRadius: 1,
      }}
    />
  </div>
)

const CloseButton = ({ onDismiss }: { onDismiss: () => void }) => (
  <button
    onClick={onDismiss}
    style={{
      position: 'absolute',
      top: 8,
      right: 8,
      width: 16,
      height: 16,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L7 7" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 1L1 7" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </button>
)

export const Toast = ({ className }: ToastProps) => {
  const config = useToastConfig()

  useToastLimit()

  return (
    <Toaster
      position={config.position}
      containerStyle={config.containerStyle}
      toastOptions={{
        duration: config.duration,
        success: config.success,
        error: config.error,
        className: className,
      }}
    >
      {(t) => (
        <ToastBar toast={t} style={config.style} position={config.position}>
          {({ icon }) => (
            <>
              {t.type === 'error' ? <ErrorIcon /> : icon}
              <div
                style={{
                  flex: '1 1 0',
                  minHeight: 24,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {typeof t.message === 'function' ? t.message(t) : t.message}
              </div>
              <CloseButton onDismiss={() => toast.dismiss(t.id)} />
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

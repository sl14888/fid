import { ToastPosition } from 'react-hot-toast'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastIconTheme {
  primary: string
  secondary: string
}

export interface ToastTypeConfig {
  duration?: number
  iconTheme?: ToastIconTheme
  className?: string
}

export interface ToastConfig {
  position: ToastPosition
  duration: number
  style: React.CSSProperties
  success: ToastTypeConfig
  error: ToastTypeConfig
  warning: ToastTypeConfig
  info: ToastTypeConfig
  loading: ToastTypeConfig
}

export interface ToastProps {
  className?: string
}

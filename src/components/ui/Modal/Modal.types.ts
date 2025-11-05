import { ReactNode } from 'react'

export const ModalSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
  Full: 'full',
} as const

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: (typeof ModalSize)[keyof typeof ModalSize]
  children: ReactNode
  className?: string
}

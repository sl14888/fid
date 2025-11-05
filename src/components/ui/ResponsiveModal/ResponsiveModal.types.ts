import { ReactNode } from 'react'
import { ModalSize } from '../Modal/Modal.types'

export type ResponsiveModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: (typeof ModalSize)[keyof typeof ModalSize] // Для desktop (Modal)
  snapPoints?: number[] // Для mobile (BottomSheet)
  initialSnap?: number // Для mobile (BottomSheet)
  disableCloseOnEscape?: boolean // Только для desktop (Modal)
  disableSwipeToClose?: boolean // Только для mobile (BottomSheet)
  disableCloseOnOverlay?: boolean // Для обоих
  children: ReactNode
  className?: string
}

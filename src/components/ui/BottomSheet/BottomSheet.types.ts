import { ReactNode } from 'react'

export type BottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  snapPoints?: number[] // В процентах высоты viewport (например, [50, 75, 100])
  initialSnap?: number // Индекс начальной точки в массиве snapPoints
  disableSwipeToClose?: boolean
  disableCloseOnOverlay?: boolean
  children: ReactNode
  className?: string
}

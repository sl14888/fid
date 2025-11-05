'use client'

import { FC } from 'react'
import { Modal } from '@/components/ui/Modal'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ResponsiveModalProps } from './ResponsiveModal.types'
import { ModalSize } from '../Modal/Modal.types'

export const ResponsiveModal: FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  size = ModalSize.Medium,
  snapPoints = [100],
  initialSnap = 0,
  disableSwipeToClose = false,
  disableCloseOnOverlay = false,
  children,
  className,
}) => {
  const isMobile = useMediaQuery(640)

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        snapPoints={snapPoints}
        initialSnap={initialSnap}
        disableSwipeToClose={disableSwipeToClose}
        disableCloseOnOverlay={disableCloseOnOverlay}
        className={className}
      >
        {children}
      </BottomSheet>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      className={className}
    >
      {children}
    </Modal>
  )
}

ResponsiveModal.displayName = 'ResponsiveModal'

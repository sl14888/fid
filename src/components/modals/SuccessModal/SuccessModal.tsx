'use client'

import { FC, useEffect } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant } from '@/components/ui/Button'
import { Heading4, TextLRegular } from '@/components/ui/Typography'
import { SuccessModalProps } from './SuccessModal.types'
import styles from './SuccessModal.module.scss'
import { ModalSize } from '@/components/ui/Modal/Modal.types'

export const SuccessModal: FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = 'Успешно',
  message,
  onConfirm,
  confirmButtonText = 'OK',
  className,
}) => {
  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={ModalSize.Small}
      className={className}
    >
      <div className={styles.successModal}>
        <div className={styles.content}>
          <TextLRegular className={styles.message}>{message}</TextLRegular>
        </div>

        <div className={styles.actions}>
          <Button
            text={confirmButtonText}
            variant={ButtonVariant.Primary}
            onClick={handleConfirm}
            fluid
          />
        </div>
      </div>
    </ResponsiveModal>
  )
}

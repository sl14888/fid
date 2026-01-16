'use client'

import { FC } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { ModalSize } from '@/components/ui/Modal'
import { TextLRegular } from '@/components/ui/Typography'
import styles from './ConfirmDeleteModal.module.scss'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
  title?: string
  description?: string
}

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = 'Удалить фото?',
  description,
}) => {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={ModalSize.Small}
    >
      <div className={styles.confirmDeleteModal}>
        {description && (
          <TextLRegular className={styles.confirmDeleteModal__description}>
            {description}
          </TextLRegular>
        )}
        <div className={styles.confirmDeleteModal__actions}>
          <Button
            variant={ButtonVariant.SecondaryBlue}
            size={ButtonSize.Default}
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Удалить
          </Button>

          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={onClose}
            disabled={isDeleting}
          >
            Отмена
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}

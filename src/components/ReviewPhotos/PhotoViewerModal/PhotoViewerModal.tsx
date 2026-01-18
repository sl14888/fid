'use client'

import { FC, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Icon, IconName } from '@/components/ui/Icon'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { useScrollLock } from '@/lib/hooks/useScrollLock'
import type { UploadedPhoto } from '@/types/file.types'
import styles from './PhotoViewerModal.module.scss'

interface PhotoViewerModalProps {
  isOpen: boolean
  onClose: () => void
  photos: UploadedPhoto[]
  initialIndex: number
  onPhotoDelete?: (id: number) => Promise<void>
}

export const PhotoViewerModal: FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  photos,
  initialIndex,
  onPhotoDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
    })
  }, [])

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useScrollLock(isOpen)

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  useEffect(() => {
    if (!isOpen || isConfirmDeleteOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, photos.length, isConfirmDeleteOpen])

  const handleDeleteClick = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (photos.length === 0 || !onPhotoDelete) return

    const currentPhoto = photos[currentIndex]
    setIsDeleting(true)

    try {
      await onPhotoDelete(currentPhoto.id)

      if (photos.length > 1) {
        const newIndex = currentIndex >= photos.length - 1 ? 0 : currentIndex
        setCurrentIndex(newIndex)
        setIsConfirmDeleteOpen(false)
      } else {
        setIsConfirmDeleteOpen(false)
        onClose()
      }
    } catch (error) {
      console.error('Ошибка удаления фото:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!mounted || !isOpen || photos.length === 0) return null

  const currentPhoto = photos[currentIndex]

  if (!currentPhoto) return null

  const handleImageContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const modal = (
    <>
      <div className={styles.fullscreenModal}>
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-label="Закрыть"
        />

        <div className={styles.content}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Закрыть"
          >
            <Icon name={IconName.Cross} size="large" />
          </button>

          <div
            className={styles.imageContainer}
            onClick={handleImageContainerClick}
          >
            <img
              src={currentPhoto.url}
              alt={`Фото ${currentIndex + 1}`}
              className={styles.image}
            />
          </div>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrevious}
                aria-label="Предыдущее фото"
              >
                <Icon name={IconName.ArrowLeft} />
              </button>

              <button
                type="button"
                className={clsx(styles.navButton, styles.navButtonRight)}
                onClick={handleNext}
                aria-label="Следующее фото"
              >
                <Icon name={IconName.ArrowRight} />
              </button>
            </>
          )}

          {onPhotoDelete && (
            <div
              className={styles.deleteButtonContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant={ButtonVariant.PrimaryInverse}
                size={ButtonSize.Default}
                onClick={handleDeleteClick}
                className={styles.deleteButton}
                text="Удалить фото"
              />
            </div>
          )}
        </div>
      </div>

      {onPhotoDelete && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  )

  return createPortal(modal, document.body)
}

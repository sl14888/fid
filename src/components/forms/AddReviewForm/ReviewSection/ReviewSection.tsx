import { Control, FieldErrors, Controller } from 'react-hook-form'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Rating } from '@/components/ui/Rating'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { IconName } from '@/components/ui/Icon'
import { PhotoThumbnail } from '@/components/ReviewPhotos/PhotoThumbnail'
import { PhotoViewerModal } from '@/components/ReviewPhotos'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { AddReviewFormData } from '@/lib/validations/review.schema'
import { REVIEW_FORM_LIMITS } from '@/constants/forms'
import { LabelM } from '@/components/ui/Typography'
import type { UploadedPhoto } from '@/types/file.types'
import { PHOTO_UPLOAD_LIMITS } from '@/types/file.types'
import styles from './ReviewSection.module.scss'

interface ReviewSectionProps {
  control: Control<AddReviewFormData>
  errors: FieldErrors<AddReviewFormData>
  photos: UploadedPhoto[]
  isUploading: boolean
  isRestoring: boolean
  onPhotosUpload: (files: File[]) => void
  onPhotoDelete: (id: number) => Promise<void>
}

export const ReviewSection = ({
  control,
  errors,
  photos,
  isUploading,
  isRestoring,
  onPhotosUpload,
  onPhotoDelete,
}: ReviewSectionProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true)
    })
  }, [])

  const handlePhotoClick = (photo: UploadedPhoto, index: number) => {
    setSelectedPhotoIndex(index)
    setIsViewerOpen(true)
  }

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList || fileList.length === 0) return

    const filesArray = Array.from(fileList)
    onPhotosUpload(filesArray)

    // Очистить для повторной загрузки
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteClick = (photoId: number) => {
    setPhotoToDelete(photoId)
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (photoToDelete === null) return

    setIsDeleting(true)
    try {
      await onPhotoDelete(photoToDelete)
      setIsConfirmDeleteOpen(false)
      setPhotoToDelete(null)
    } catch (error) {
      console.error('Ошибка удаления фото:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const isLimitReached = photos.length >= PHOTO_UPLOAD_LIMITS.MAX_PHOTOS

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <LabelM>Оценка</LabelM>

        <div className={styles.section_box}>
          <div className={styles.grade}>
            {isMounted && (
              <Controller
                name="review.grade"
                control={control}
                render={({ field }) => (
                  <Rating
                    size="large"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
            {errors.review?.grade && (
              <p className={styles.error}>{errors.review.grade.message}</p>
            )}
          </div>

          {!isLimitReached && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                className={styles.fileInput}
                disabled={isRestoring || isUploading}
              />

              <Button
                variant={ButtonVariant.SecondaryBlue}
                size={ButtonSize.Small}
                text="Добавить фото"
                iconLeft={IconName.Plus}
                onClick={handleAddPhotoClick}
                disabled={isRestoring || isUploading || isLimitReached}
                loading={isUploading}
                type="button"
              />
            </div>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        <div className={styles.photosContainer}>
          {photos.map((photo, index) => (
            <PhotoThumbnail
              key={photo.id}
              url={photo.url}
              onDelete={() => handleDeleteClick(photo.id)}
              onClick={() => handlePhotoClick(photo, index)}
              isDeleting={photo.isUploading}
            />
          ))}
        </div>
      )}

      <div className={styles.section_wrapper}>
        <LabelM>Плюсы</LabelM>
        <Controller
          name="review.pluses"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Опишите преимущества"
              helperText="Не более 3 000 символов"
              error={errors.review?.pluses?.message}
              maxLength={REVIEW_FORM_LIMITS.TEXT_FIELD_MAX_LENGTH}
              showCounter
              rows={4}
            />
          )}
        />
      </div>

      <div className={styles.section_wrapper}>
        <LabelM>Минусы</LabelM>
        <Controller
          name="review.minuses"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Что не понравилось"
              helperText="Не более 3 000 символов"
              error={errors.review?.minuses?.message}
              maxLength={REVIEW_FORM_LIMITS.TEXT_FIELD_MAX_LENGTH}
              showCounter
              rows={4}
            />
          )}
        />
      </div>
      <div className={styles.section_wrapper}>
        <LabelM>Комментарий</LabelM>
        <Controller
          name="review.description"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Дополните отзыв"
              helperText="Не более 3 000 символов"
              error={errors.review?.description?.message}
              maxLength={REVIEW_FORM_LIMITS.TEXT_FIELD_MAX_LENGTH}
              showCounter
              required
              rows={4}
            />
          )}
        />
      </div>

      <PhotoViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        photos={photos}
        initialIndex={selectedPhotoIndex}
        onPhotoDelete={onPhotoDelete}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}

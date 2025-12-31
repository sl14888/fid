'use client'

import { FC, useRef, ChangeEvent } from 'react'
import { PhotoThumbnail } from '../PhotoThumbnail'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { IconName } from '@/components/ui/Icon'
import { TextMRegular } from '@/components/ui/Typography'
import type { UploadedPhoto } from '@/types/file.types'
import { PHOTO_UPLOAD_LIMITS } from '@/types/file.types'
import styles from './PhotoGallery.module.scss'

interface PhotoGalleryProps {
  photos: UploadedPhoto[]
  onPhotosSelect: (files: File[]) => void
  onPhotoDelete: (id: number) => void
  onPhotoClick: (photo: UploadedPhoto, index: number) => void
  isUploading?: boolean
  disabled?: boolean
  className?: string
}

export const PhotoGallery: FC<PhotoGalleryProps> = ({
  photos,
  onPhotosSelect,
  onPhotoDelete,
  onPhotoClick,
  isUploading,
  disabled,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList || fileList.length === 0) return

    const filesArray = Array.from(fileList)
    onPhotosSelect(filesArray)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isLimitReached = photos.length >= PHOTO_UPLOAD_LIMITS.MAX_PHOTOS

  return (
    <div className={className}>
      <div className={styles.gallery}>
        {photos.map((photo, index) => (
          <PhotoThumbnail
            key={photo.id}
            url={photo.url}
            onDelete={() => onPhotoDelete(photo.id)}
            onClick={() => onPhotoClick(photo, index)}
            isDeleting={photo.isUploading}
          />
        ))}

        {!isLimitReached && (
          <div className={styles.gallery__addButton}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className={styles.gallery__fileInput}
              disabled={disabled || isUploading}
            />

            <Button
              variant={ButtonVariant.SecondaryBlue}
              size={ButtonSize.Small}
              text="Добавить фото"
              iconLeft={IconName.Plus}
              onClick={handleButtonClick}
              disabled={disabled || isUploading || isLimitReached}
              loading={isUploading}
              className={styles.gallery__button}
            />
          </div>
        )}
      </div>

      {isLimitReached && (
        <TextMRegular className={styles.gallery__limit}>
          Достигнут лимит фотографий
        </TextMRegular>
      )}
    </div>
  )
}

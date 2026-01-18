'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'

import { IconName } from '@/components/ui/Icon'

import { ReviewCardSkeleton } from './ReviewCardSkeleton'
import { ReviewCardHeader } from './ReviewCardHeader'
import { ReviewCardSection } from './ReviewCardSection'
import { ReviewCardFooter } from './ReviewCardFooter'
import { PhotoGallery } from './PhotoGallery'
import { PhotoViewerModal } from '@/components/ReviewPhotos'

import type { ReviewCardProps } from './ReviewCard.types'
import type { UploadedPhoto } from '@/types/file.types'

import styles from './ReviewCard.module.scss'

export const ReviewCard: FC<ReviewCardProps> = ({
  variant,
  feedback,
  fluid = false,
  loading = false,
  className,
  onReadMore,
  fullReview = false,
}) => {
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const displayName =
    variant === 'user' ? feedback.userName : feedback.companyName

  const photos: UploadedPhoto[] = (feedback.files || []).map((file) => ({
    id: file.id,
    url: file.url,
  }))

  const hasPhotos = photos.length > 0

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsPhotoViewerOpen(true)
  }

  const handleCardClick = () => {
    if (!fullReview) {
      onReadMore?.()
    }
  }

  if (loading) {
    return <ReviewCardSkeleton fluid={fluid} className={className} />
  }

  return (
    <article
      className={clsx(
        styles.reviewCard,
        fluid && styles['reviewCard--fluid'],
        !fullReview && styles['reviewCard--clickable'],
        className
      )}
      onClick={handleCardClick}
    >
      <div>
        <ReviewCardHeader
          variant={variant}
          displayName={displayName}
          dateString={feedback.createdTime}
          grade={feedback.grade}
          logoUrl={
            variant === 'user' ? feedback.userAvatar : feedback.companyAvatar
          }
        />

        {hasPhotos && fullReview && (
          <PhotoGallery
            photos={feedback.files!}
            onPhotoClick={handlePhotoClick}
            className={styles.reviewCard__photoGallery}
          />
        )}

        <div className={styles.reviewCard__content}>
          {feedback.pluses && (
            <ReviewCardSection
              iconName={IconName.Plus}
              text={feedback.pluses}
              fullReview={fullReview}
            />
          )}

          {feedback.minuses && (
            <ReviewCardSection
              iconName={IconName.Minus}
              text={feedback.minuses}
              fullReview={fullReview}
            />
          )}

          {feedback.description && (
            <ReviewCardSection
              iconName={IconName.Review}
              text={feedback.description}
              fullReview={fullReview}
            />
          )}
        </div>
      </div>

      <ReviewCardFooter
        feedback={feedback}
        hasPhotos={hasPhotos}
        fullReview={fullReview}
        showButton={!fullReview}
        onReadMore={onReadMore}
      />

      <PhotoViewerModal
        isOpen={isPhotoViewerOpen}
        onClose={() => setIsPhotoViewerOpen(false)}
        photos={photos}
        initialIndex={selectedPhotoIndex}
      />
    </article>
  )
}

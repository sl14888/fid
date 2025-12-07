'use client'

import { FC } from 'react'
import clsx from 'clsx'

import { IconName } from '@/components/ui/Icon'
import { Heading4, TextMMedium } from '@/components/ui/Typography'

import { ReviewCardSkeleton } from './ReviewCardSkeleton'
import { ReviewCardHeader } from './ReviewCardHeader'
import { ReviewCardSection } from './ReviewCardSection'
import { ReviewCardFooter } from './ReviewCardFooter'

import type { ReviewCardProps } from './ReviewCard.types'

import styles from './ReviewCard.module.scss'

/**
 * Компонент карточки отзыва
 * Поддерживает два варианта отображения: с пользователем или с компанией
 */
export const ReviewCard: FC<ReviewCardProps> = ({
  variant,
  feedback,
  logoUrl,
  fluid = false,
  loading = false,
  className,
  onReadMore,
  fullReview = false,
}) => {
  const displayName =
    variant === 'user' ? feedback.userName : feedback.companyName

  if (loading) {
    return <ReviewCardSkeleton fluid={fluid} className={className} />
  }

  return (
    <article
      className={clsx(
        styles.reviewCard,
        fluid && styles['reviewCard--fluid'],
        className
      )}
    >
      <ReviewCardHeader
        variant={variant}
        displayName={displayName}
        dateString={feedback.createdTime}
        grade={feedback.grade}
        logoUrl={logoUrl}
      />

      {feedback.title && (
        <TextMMedium className={styles.reviewCard__title}>
          {feedback.title}
        </TextMMedium>
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

      <ReviewCardFooter onReadMore={onReadMore} showButton={!fullReview} />
    </article>
  )
}

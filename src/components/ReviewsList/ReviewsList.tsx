'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@/lib/hooks'
import { ReviewCard } from '@/components/ReviewCard'
import type { ReviewsListProps } from './ReviewsList.types'
import { TextMMedium } from '../ui/Typography'
import { BREAKPOINTS } from '@/constants/breakpoints'

import styles from './ReviewsList.module.scss'

/**
 * Компонент списка отзывов
 */
export const ReviewsList: FC<ReviewsListProps> = ({
  reviews,
  isLoading = false,
  className = '',
  showSkeletons = true,
  skeletonsCount = 8,
}) => {
  const router = useRouter()
  const isMobile = useMediaQuery(BREAKPOINTS.MD)

  const handleReadMore = (reviewId: number) => {
    router.push(`/reviews/${reviewId}`)
  }

  if (isLoading && showSkeletons) {
    return (
      <div className={`${styles.reviewsList} ${className}`}>
        <div className={styles.reviewsList__grid}>
          {Array.from({ length: skeletonsCount }).map((_, index) => (
            <ReviewCard
              key={`skeleton-${index}`}
              variant="company"
              feedback={{}}
              loading
              fluid={isMobile}
            />
          ))}
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorState__content}>
          <TextMMedium className={styles.errorState__title}>
            Отзывов на этой странице нет
          </TextMMedium>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.reviewsList} ${className}`}>
      <div className={styles.reviewsList__grid}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            variant="company"
            feedback={review}
            fluid={isMobile}
            onReadMore={() => handleReadMore(review.id || 0)}
          />
        ))}
      </div>
    </div>
  )
}

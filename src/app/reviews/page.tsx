'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ReviewCard } from '@/components/ReviewCard'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { Heading2, TextLRegular } from '@/components/ui/Typography'
import {
  useAdminReviewsPage,
  useScrollIntoView,
  useMediaQuery,
} from '@/lib/hooks'
import { useAuthStore } from '@/store/auth.store'
import { Role } from '@/types/common.types'
import { BREAKPOINTS } from '@/constants/breakpoints'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

import styles from './page.module.scss'

export default function AdminReviewsPage() {
  const router = useRouter()
  const reviewsSectionRef = useRef<HTMLDivElement>(null)
  const scrollToReviews = useScrollIntoView(reviewsSectionRef)
  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const { user, isAuthenticated } = useAuthStore()

  const {
    reviews,
    currentPage,
    totalPages,
    totalElements,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    handlePageChange,
    handleLoadMore,
    clearError,
    loadReviews,
  } = useAdminReviewsPage({
    onScrollToSection: scrollToReviews,
  })

  const isInitializing = !user && !isAuthenticated

  useEffect(() => {
    if (!isInitializing && user && user.role !== Role.ADMIN) {
      router.push('/')
    }
  }, [user, isInitializing, router])

  useEffect(() => {
    scrollIntoView()
  }, [])

  if (isInitializing) {
    return null
  }

  if (!user || user.role !== Role.ADMIN) {
    return null
  }

  const handleReviewClick = (reviewId: number) => {
    router.push(`/reviews/${reviewId}/edit`)
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className={styles.reviewsPage__errorState}>
          <TextLRegular>{error}</TextLRegular>
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={() => {
              clearError()
              loadReviews(0)
            }}
          >
            Попробовать снова
          </Button>
        </div>
      )
    }

    if (isFetched && !isLoadingPage && (!reviews || reviews.length === 0)) {
      return (
        <div className={styles.reviewsPage__emptyState}>
          <TextLRegular className={styles.reviewsPage__emptyText}>
            Отзывов пока нет
          </TextLRegular>
        </div>
      )
    }

    return (
      <>
        <div className={styles.reviewsPage__list}>
          {(!isFetched || isLoadingPage) &&
            Array.from({ length: 4 }).map((_, index) => (
              <ReviewCard
                key={index}
                variant="user"
                feedback={{} as any}
                loading
                fluid
              />
            ))}

          {isFetched &&
            !isLoadingPage &&
            reviews &&
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                variant="user"
                feedback={review}
                fluid
                onReadMore={() => handleReviewClick(review.id!)}
              />
            ))}
        </div>

        {isFetched && (
          <div className={styles.reviewsPage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore || isLoadingPage}
                className={styles.reviewsPage__loadMore}
              >
                Загрузить ещё
              </Button>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={isLoadingPage}
                className={styles.reviewsPage__pagination}
              />
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <div className={styles.reviewsPage}>
      <section className={styles.reviewsPage__header}>
        <div className={styles.reviewsPage__headerContent}>
          <Heading2>Новые отзывы</Heading2>
          {totalElements > 0 && (
            <Heading2 className={styles.reviewsPage__totalCount}>
              {totalElements}
            </Heading2>
          )}
        </div>
      </section>

      <section className={styles.reviewsPage__content} ref={reviewsSectionRef}>
        {renderContent()}
      </section>
    </div>
  )
}

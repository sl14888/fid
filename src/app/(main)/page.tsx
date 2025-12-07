'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HeroSection } from '@/components/HeroSection'
import { TopCompanies } from '@/components/TopCompanies'
import { ReviewsList, ReviewsErrorState } from '@/components/ReviewsList'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { Heading3 } from '@/components/ui/Typography'
import { useReviewsPage, useScrollIntoView, useMediaQuery } from '@/lib/hooks'
import { SortOrder, SortType } from '@/types/request.types'
import { BREAKPOINTS } from '@/constants/breakpoints'

import styles from './page.module.scss'

export default function HomePage() {
  const router = useRouter()
  const reviewsSectionRef = useRef<HTMLDivElement>(null)
  const scrollToReviews = useScrollIntoView(reviewsSectionRef)
  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const {
    reviews,
    currentPage,
    totalPages,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    handlePageChange,
    handleLoadMore,
    clearError,
    loadReviews,
  } = useReviewsPage({
    sortType: SortType.TIME,
    sortOrder: SortOrder.DESC,
    onScrollToSection: scrollToReviews,
  })

  const handleAddReview = () => {
    router.push('/reviews/new')
  }

  const renderContent = () => {
    if (error) {
      return (
        <ReviewsErrorState
          error={error}
          onRetry={() => {
            clearError()
            loadReviews(0)
          }}
        />
      )
    }

    return (
      <>
        <ReviewsList
          reviews={!isFetched || isLoadingPage ? [] : reviews}
          isLoading={!isFetched || isLoadingPage}
          skeletonsCount={8}
          showSkeletons={!isFetched || isLoadingPage}
        />

        {isFetched && (
          <div className={styles.homePage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore || isLoadingPage}
                className={styles.homePage__loadMore}
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
                className={styles.homePage__pagination}
              />
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <div className={styles.homePage}>
      <HeroSection onAddReview={handleAddReview}>
        <TopCompanies />
      </HeroSection>

      <section className={styles.homePage__reviews} ref={reviewsSectionRef}>
        <div>
          <div className={styles.homePage__reviewsHeader}>
            <Heading3>Новые отзывы</Heading3>
          </div>

          {renderContent()}
        </div>
      </section>
    </div>
  )
}

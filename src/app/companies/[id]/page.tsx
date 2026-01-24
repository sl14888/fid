'use client'

import { useRef, use, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CompanyCard } from '@/components/CompanyCard'
import { CompanyCardSkeleton } from '@/components/CompanyCard/CompanyCardSkeleton'
import { ReviewCard } from '@/components/ReviewCard'
import { ReviewsErrorState } from '@/components/ReviewsList'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { TextMRegular } from '@/components/ui/Typography'
import { useCompanyPage } from '@/lib/hooks/useCompanyPage'
import { useSessionStorage } from '@/lib/hooks/useSessionStorage'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'
import { ADD_REVIEW_FORM_DEFAULT_VALUES } from '@/constants/forms'
import type { AddReviewFormData } from '@/lib/validations/review.schema'
import type { CompanyAvatar } from '@/types/file.types'

import styles from './page.module.scss'
import { useMediaQuery } from '@/lib/hooks'
import { BREAKPOINTS } from '@/constants/breakpoints'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

interface CompanyPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const companyId = Number(id)

  const feedbacksSectionRef = useRef<HTMLDivElement>(null)

  const {
    company,
    feedbacks,
    currentPage,
    totalPages,
    isLoadingCompany,
    isLoadingFeedbacks,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    handlePageChange,
    handleLoadMore,
    retry,
  } = useCompanyPage(companyId)

  const [, setReviewFormData] = useSessionStorage<AddReviewFormData>(
    SESSION_STORAGE_KEYS.ADD_REVIEW_FORM,
    ADD_REVIEW_FORM_DEFAULT_VALUES
  )

  const [, setAvatarData, clearAvatarData] = useSessionStorage<CompanyAvatar | null>(
    SESSION_STORAGE_KEYS.COMPANY_AVATAR,
    null
  )

  useEffect(() => {
    scrollIntoView()
  }, [])

  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const handleReviewClick = useCallback(() => {
    if (!company) return

    setReviewFormData({
      company: {
        id: company.id,
        name: company.name,
        employmentType: company.employmentType.id || 0,
        website: company.website || '',
        inn: company.inn?.toString() || '',
        isExistingCompany: true,
      },
      review: {
        grade: 0,
        pluses: '',
        minuses: '',
        description: '',
      },
    })

    if (company.avatar?.url) {
      setAvatarData({
        id: company.avatar.id ?? 0,
        url: company.avatar.url,
      })
    } else {
      clearAvatarData()
    }

    router.push('/reviews/new')
  }, [company, setReviewFormData, setAvatarData, clearAvatarData, router])

  const handleReadMore = (reviewId: number) => {
    router.push(`/reviews/${reviewId}`)
  }

  const renderCompanyCard = () => {
    if (isLoadingCompany) {
      return <CompanyCardSkeleton fluid />
    }

    if (error && !company) {
      return (
        <ReviewsErrorState
          error="Компания не найдена"
          onRetry={retry}
          className={styles.companyPage__error}
        />
      )
    }

    if (!company) {
      return null
    }

    return (
      <CompanyCard
        name={company.name}
        employmentType={company.employmentType}
        inn={company.inn}
        averageGrade={company.averageGrade}
        website={company.website}
        onReviewClick={handleReviewClick}
        logoUrl={company.avatar.url}
        fluid
        hideAllReviewsButton
      />
    )
  }

  const renderFeedbacksSection = () => {
    if (error && !company) {
      return null
    }

    if (isLoadingFeedbacks && !isFetched) {
      return (
        <div className={styles.companyPage__feedbacksGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ReviewCard
              key={`skeleton-${index}`}
              variant="user"
              feedback={{}}
              loading
              fluid
            />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <ReviewsErrorState
          error="Ошибка при загрузке отзывов"
          onRetry={retry}
        />
      )
    }

    if (feedbacks.length === 0 && isFetched) {
      return (
        <div className={styles.companyPage__emptyState}>
          <TextMRegular className={styles.companyPage__emptyText}>
            У этой компании пока нет отзывов
          </TextMRegular>
        </div>
      )
    }

    return (
      <>
        <div className={styles.companyPage__feedbacksGrid}>
          {feedbacks.map((feedback) => (
            <ReviewCard
              key={feedback.id}
              variant="user"
              feedback={feedback}
              fluid
              onReadMore={() => handleReadMore(feedback.id || 0)}
            />
          ))}
        </div>

        {isFetched && (
          <div className={styles.companyPage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore || isLoadingFeedbacks}
                className={styles.companyPage__loadMore}
              >
                Загрузить ещё
              </Button>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={isLoadingFeedbacks}
                className={styles.companyPage__pagination}
              />
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <section className={styles.companyPage}>
      <div>{renderCompanyCard()}</div>

      <div
        className={styles.companyPage__feedbacks}
        ref={feedbacksSectionRef}
        id="company-feedbacks"
      >
        <div>{renderFeedbacksSection()}</div>
      </div>
    </section>
  )
}

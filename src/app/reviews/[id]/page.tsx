'use client'

import { use, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CompanyCard } from '@/components/CompanyCard'
import { CompanyCardSkeleton } from '@/components/CompanyCard/CompanyCardSkeleton'
import { ReviewCard } from '@/components/ReviewCard'
import { ReviewsErrorState } from '@/components/ReviewsList'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { IconName } from '@/components/ui/Icon'
import { useReviewDetail } from '@/lib/hooks/useReviewDetail'
import { useSessionStorage } from '@/lib/hooks/useSessionStorage'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'
import { ADD_REVIEW_FORM_DEFAULT_VALUES } from '@/constants/forms'
import type { AddReviewFormData } from '@/lib/validations/review.schema'
import type { CompanyAvatar } from '@/types/file.types'

import styles from './page.module.scss'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

interface ReviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id } = use(params)
  const reviewId = Number(id)
  const isFromMainPage = searchParams.get('from') === 'main'

  const {
    review,
    company,
    isLoadingReview,
    isLoadingCompany,
    isFetched,
    error,
    hasPrev,
    hasNext,
    isNavigatingPrev,
    isNavigatingNext,
    handlePrevious,
    handleNext,
    retry,
  } = useReviewDetail(reviewId)

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

  const handleAddReview = useCallback(() => {
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

  const handleAllReviews = () => {
    if (company?.id) {
      router.push(`/companies/${company.id}`)
    }
  }

  const renderCompanyCard = () => {
    if (isLoadingCompany) {
      return <CompanyCardSkeleton fluid />
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
        onReviewClick={handleAddReview}
        logoUrl={company.avatar.url}
        onAllReviewsClick={handleAllReviews}
        fluid
      />
    )
  }

  const renderReviewCard = () => {
    if (error && !review) {
      return (
        <ReviewsErrorState
          error={error === 'Некорректный ID отзыва' ? error : 'Отзыв не найден'}
          onRetry={retry}
          className={styles.reviewPage__error}
        />
      )
    }

    if (isLoadingReview && !isFetched) {
      return (
        <ReviewCard variant="user" feedback={{}} loading fluid fullReview />
      )
    }

    if (!review) {
      return null
    }

    return <ReviewCard variant="user" feedback={review} fluid fullReview />
  }

  const renderNavigation = () => {
    if (!review || error || isFromMainPage || (!hasPrev && !hasNext)) {
      return null
    }

    return (
      <div className={styles.reviewPage__navigation}>
        {hasPrev && (
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            iconLeft={IconName.ArrowLeft}
            onClick={handlePrevious}
            loading={isNavigatingPrev}
            disabled={isNavigatingPrev || isNavigatingNext}
            className={styles.reviewPage__navButton}
          >
            Предыдущий
          </Button>
        )}
        {hasNext && (
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            iconRight={IconName.ArrowRight}
            onClick={handleNext}
            loading={isNavigatingNext}
            disabled={isNavigatingPrev || isNavigatingNext}
            className={styles.reviewPage__navButton}
          >
            Следующий
          </Button>
        )}
      </div>
    )
  }

  return (
    <section className={styles.reviewPage}>
      <div className={styles.reviewPage__company}>{renderCompanyCard()}</div>

      <div className={styles.reviewPage__review}>{renderReviewCard()}</div>

      {renderNavigation()}
    </section>
  )
}

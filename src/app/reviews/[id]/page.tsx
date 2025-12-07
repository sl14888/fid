'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { CompanyCard } from '@/components/CompanyCard'
import { CompanyCardSkeleton } from '@/components/CompanyCard/CompanyCardSkeleton'
import { ReviewCard } from '@/components/ReviewCard'
import { ReviewsErrorState } from '@/components/ReviewsList'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { IconName } from '@/components/ui/Icon'
import { useReviewDetail } from '@/lib/hooks/useReviewDetail'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'

import styles from './page.module.scss'

interface ReviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const reviewId = Number(id)

  const {
    review,
    company,
    isLoadingReview,
    isLoadingCompany,
    isFetched,
    error,
    canGoPrev,
    canGoNext,
    handlePrevious,
    handleNext,
    retry,
  } = useReviewDetail(reviewId)

  const handleAddReview = () => {
    if (typeof window !== 'undefined' && company) {
      const reviewFormData = {
        company: {
          name: company.name,
          employmentType: company.employmentType.id || 0,
          website: company.website || '',
          inn: company.inn?.toString() || '',
          isExistingCompany: true,
        },
        review: {
          title: '',
          grade: 0,
          pluses: '',
          minuses: '',
          description: '',
        },
      }
      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.ADD_REVIEW_FORM,
        JSON.stringify(reviewFormData)
      )
    }
    router.push('/reviews/new')
  }

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
        description={company.address}
        website={company.website}
        onReviewClick={handleAddReview}
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
    if (!review || error) {
      return null
    }

    return (
      <div className={styles.reviewPage__navigation}>
        <Button
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Small}
          iconLeft={IconName.ArrowLeft}
          onClick={handlePrevious}
          disabled={!canGoPrev}
          className={styles.reviewPage__navButton}
        >
          Предыдущий
        </Button>
        <Button
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Small}
          iconRight={IconName.ArrowRight}
          onClick={handleNext}
          disabled={!canGoNext}
          className={styles.reviewPage__navButton}
        >
          Следующий
        </Button>
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

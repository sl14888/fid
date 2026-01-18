'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFeedbackById, getFeedbackBetween } from '@/lib/api/feedbacks.api'
import { getCompanyById } from '@/lib/api/companies.api'
import { showToast } from '@/lib/utils/toast-utils'
import type { FeedbackDto } from '@/types/feedback.types'
import type { CompanyWithFeedbacksDto } from '@/types/company.types'

interface UseReviewDetailReturn {
  review: FeedbackDto | null
  company: CompanyWithFeedbacksDto | null
  isLoadingReview: boolean
  isLoadingCompany: boolean
  isFetched: boolean
  error: string | null
  hasPrev: boolean
  hasNext: boolean
  isNavigatingPrev: boolean
  isNavigatingNext: boolean
  handlePrevious: () => Promise<void>
  handleNext: () => Promise<void>
  retry: () => void
}

/**
 * Хук для управления страницей детального просмотра отзыва
 * Загружает отзыв и компанию, управляет навигацией между отзывами
 */
export const useReviewDetail = (reviewId: number): UseReviewDetailReturn => {
  const router = useRouter()

  const [review, setReview] = useState<FeedbackDto | null>(null)
  const [isLoadingReview, setIsLoadingReview] = useState(true)

  const [company, setCompany] = useState<CompanyWithFeedbacksDto | null>(null)
  const [isLoadingCompany, setIsLoadingCompany] = useState(false)

  const [isFetched, setIsFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isNavigatingPrev, setIsNavigatingPrev] = useState(false)
  const [isNavigatingNext, setIsNavigatingNext] = useState(false)

  /**
   * Загрузить компанию по ID
   */
  const loadCompany = useCallback(async (companyId: number) => {
    setIsLoadingCompany(true)

    try {
      const companyData = await getCompanyById(companyId)
      setCompany(companyData)
    } catch (err) {
      console.error('Ошибка загрузки компании:', err)
    } finally {
      setIsLoadingCompany(false)
    }
  }, [])

  /**
   * Загрузить отзыв по ID
   */
  const loadReview = useCallback(async () => {
    if (!reviewId || reviewId <= 0) {
      setError('Некорректный ID отзыва')
      setIsLoadingReview(false)
      return
    }

    setIsLoadingReview(true)
    setError(null)

    try {
      const reviewData = await getFeedbackById(reviewId)
      setReview(reviewData)
      setIsFetched(true)

      if (reviewData.companyId) {
        loadCompany(reviewData.companyId)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки отзыва'
      setError(errorMessage)
    } finally {
      setIsLoadingReview(false)
    }
  }, [reviewId, loadCompany])

  /**
   * Навигация к предыдущему отзыву
   */
  const handlePrevious = useCallback(async () => {
    if (!review?.hasPrev || isNavigatingPrev) return

    setIsNavigatingPrev(true)

    try {
      const prevReview = await getFeedbackBetween({
        id: reviewId,
        prev: true,
      })

      if (prevReview.id) {
        router.push(`/reviews/${prevReview.id}`)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ошибка загрузки предыдущего отзыва'
      showToast.error(errorMessage)
    } finally {
      setIsNavigatingPrev(false)
    }
  }, [review?.hasPrev, reviewId, router, isNavigatingPrev])

  /**
   * Навигация к следующему отзыву
   */
  const handleNext = useCallback(async () => {
    if (!review?.hasNext || isNavigatingNext) return

    setIsNavigatingNext(true)

    try {
      const nextReview = await getFeedbackBetween({
        id: reviewId,
        next: true,
      })

      if (nextReview.id) {
        router.push(`/reviews/${nextReview.id}`)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки следующего отзыва'
      showToast.error(errorMessage)
    } finally {
      setIsNavigatingNext(false)
    }
  }, [review?.hasNext, reviewId, router, isNavigatingNext])

  /**
   * Повторная попытка загрузки
   */
  const retry = useCallback(() => {
    loadReview()
  }, [loadReview])

  // Загрузка отзыва при монтировании или изменении ID
  useEffect(() => {
    loadReview()
  }, [loadReview])

  const hasPrev = review?.hasPrev ?? false
  const hasNext = review?.hasNext ?? false

  return {
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
  }
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFeedbackById } from '@/lib/api/feedbacks.api'
import { getCompanyById } from '@/lib/api/companies.api'
import type { FeedbackDto } from '@/types/feedback.types'
import type { CompanyWithFeedbacksDto } from '@/types/company.types'

interface UseReviewDetailReturn {
  review: FeedbackDto | null
  company: CompanyWithFeedbacksDto | null
  isLoadingReview: boolean
  isLoadingCompany: boolean
  isFetched: boolean
  error: string | null
  canGoPrev: boolean
  canGoNext: boolean
  handlePrevious: () => void
  handleNext: () => void
  retry: () => void
}

/**
 * Хук для управления страницей детального просмотра отзыва
 * Загружает отзыв и компанию, управляет навигацией между отзывами
 */
export const useReviewDetail = (reviewId: number): UseReviewDetailReturn => {
  const router = useRouter()

  // Состояния для отзыва
  const [review, setReview] = useState<FeedbackDto | null>(null)
  const [isLoadingReview, setIsLoadingReview] = useState(true)

  // Состояния для компании
  const [company, setCompany] = useState<CompanyWithFeedbacksDto | null>(null)
  const [isLoadingCompany, setIsLoadingCompany] = useState(false)

  // Общее состояние
  const [isFetched, setIsFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Загрузить компанию по ID
   */
  const loadCompany = useCallback(async (companyId: number) => {
    setIsLoadingCompany(true)

    try {
      const companyData = await getCompanyById(companyId)
      setCompany(companyData)
    } catch (err) {
      // Не показываем ошибку загрузки компании, это не критично
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

      // Загружаем компанию после получения отзыва
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
  const handlePrevious = useCallback(() => {
    if (reviewId > 1) {
      router.push(`/reviews/${reviewId - 1}`)
    }
  }, [reviewId, router])

  /**
   * Навигация к следующему отзыву
   */
  const handleNext = useCallback(() => {
    router.push(`/reviews/${reviewId + 1}`)
  }, [reviewId, router])

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

  // Проверки возможности навигации
  const canGoPrev = reviewId > 1
  const canGoNext = true // Всегда можно попробовать перейти к следующему

  return {
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
  }
}

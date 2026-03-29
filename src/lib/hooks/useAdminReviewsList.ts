'use client'

import { useState, useCallback, useEffect } from 'react'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { SortOrder } from '@/types/request.types'
import { FeedbackDto } from '@/types/feedback.types'

const PAGE_SIZE = 4

interface UseAdminReviewsListReturn {
  reviews: FeedbackDto[]
  currentPage: number
  totalPages: number
  totalElements: number
  isLoadingPage: boolean
  isLoadingMore: boolean
  isFetched: boolean
  error: string | null
  hasMore: boolean
  loadReviews: (page: number) => Promise<void>
  loadMoreReviews: () => Promise<void>
  handlePageChange: (page: number) => void
  clearError: () => void
}

export const useAdminReviewsList = (): UseAdminReviewsListReturn => {
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    feedbacks: reviews,
    pagination,
    isFetched,
    fetchModerationFeedbacks,
    loadMoreModerationFeedbacks,
    reset,
  } = useFeedbacksStore()

  useEffect(() => {
    reset()
  }, [])

  const currentPage = pagination?.currentPage ?? 0
  const totalPages = pagination?.totalPages ?? 0

  const loadReviews = useCallback(
    async (page: number) => {
      setIsLoadingPage(true)
      setError(null)

      try {
        await fetchModerationFeedbacks({
          param: SortOrder.DESC,
          page,
          size: PAGE_SIZE,
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка загрузки отзывов'
        setError(errorMessage)
      } finally {
        setIsLoadingPage(false)
      }
    },
    [fetchModerationFeedbacks]
  )

  const loadMoreReviewsHandler = useCallback(async () => {
    const nextPage = currentPage + 1

    if (nextPage >= totalPages) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      await loadMoreModerationFeedbacks({
        param: SortOrder.DESC,
        page: nextPage,
        size: PAGE_SIZE,
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки отзывов'
      setError(errorMessage)
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, totalPages, loadMoreModerationFeedbacks])

  const handlePageChange = useCallback(
    (page: number) => {
      loadReviews(page)
    },
    [loadReviews]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const hasMore = currentPage < totalPages - 1

  return {
    reviews,
    currentPage,
    totalPages,
    totalElements: pagination?.totalElements ?? 0,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    loadReviews,
    loadMoreReviews: loadMoreReviewsHandler,
    handlePageChange,
    clearError,
  }
}

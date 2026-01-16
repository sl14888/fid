'use client'

import { useState, useCallback } from 'react'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { SortOrder, SortType } from '@/types/request.types'
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
    sortFeedbacks,
    loadMoreFeedbacks,
  } = useFeedbacksStore()

  const currentPage = pagination?.currentPage ?? 0
  const totalPages = pagination?.totalPages ?? 0
  const totalElements = pagination?.totalElements ?? 0

  const loadReviews = useCallback(
    async (page: number) => {
      setIsLoadingPage(true)
      setError(null)

      try {
        await sortFeedbacks({
          type: SortType.TIME,
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
    [sortFeedbacks]
  )

  const loadMoreReviewsHandler = useCallback(async () => {
    const nextPage = currentPage + 1

    if (nextPage >= totalPages) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      await loadMoreFeedbacks({
        type: SortType.TIME,
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
  }, [currentPage, totalPages, loadMoreFeedbacks])

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
    totalElements,
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

'use client'

import { useState, useCallback } from 'react'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { SortOrder, SortType } from '@/types/request.types'
import { FeedbackDto } from '@/types/feedback.types'

const PAGE_SIZE = 8

interface UseReviewsListParams {
  sortType?: SortType
  sortOrder?: SortOrder
}

interface UseReviewsListReturn {
  reviews: FeedbackDto[]
  currentPage: number
  totalPages: number
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

/**
 * Хук для управления списком отзывов с поддержкой пагинации и Load More
 * Гибридный подход: данные в store, UI состояние локально
 */
export const useReviewsList = ({
  sortType = SortType.TIME,
  sortOrder = SortOrder.ASC,
}: UseReviewsListParams = {}): UseReviewsListReturn => {
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

  const loadReviews = useCallback(
    async (page: number) => {
      setIsLoadingPage(true)
      setError(null)

      try {
        await sortFeedbacks({
          type: sortType,
          param: sortOrder,
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
    [sortType, sortOrder, sortFeedbacks]
  )

  /**
   * Загрузить следующую страницу (аккумуляция)
   * Используется для Load More
   */
  const loadMoreReviews = useCallback(async () => {
    const nextPage = currentPage + 1

    // Проверяем, есть ли еще страницы (0-based: если currentPage = 3, totalPages = 4, то есть еще страница)
    if (nextPage >= totalPages) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      await loadMoreFeedbacks({
        type: sortType,
        param: sortOrder,
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
  }, [currentPage, totalPages, sortType, sortOrder, loadMoreFeedbacks])

  /**
   * Обработчик смены страницы для Pagination
   * Принимает 0-based индекс страницы
   */
  const handlePageChange = useCallback(
    (page: number) => {
      loadReviews(page)
    },
    [loadReviews]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Проверка наличия следующей страницы (0-based: если currentPage = 3, totalPages = 4, то hasMore = true)
  const hasMore = currentPage < totalPages - 1

  return {
    reviews,
    currentPage,
    totalPages,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    loadReviews,
    loadMoreReviews,
    handlePageChange,
    clearError,
  }
}

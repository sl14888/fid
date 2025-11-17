'use client'

import { useState, useCallback } from 'react'
import { useCompaniesStore } from '@/store/companies.store'
import { SortOrder, SortType } from '@/types/request.types'
import { CompanyWithCountFeedbacksDto } from '@/types/company.types'

const PAGE_SIZE = 8

interface UseCompaniesListParams {
  sortType?: SortType
  sortOrder?: SortOrder
}

interface UseCompaniesListReturn {
  companies: CompanyWithCountFeedbacksDto[]
  currentPage: number
  totalPages: number
  isLoadingPage: boolean
  isLoadingMore: boolean
  isFetched: boolean
  error: string | null
  hasMore: boolean
  loadCompanies: (page: number) => Promise<void>
  loadMoreCompanies: () => Promise<void>
  handlePageChange: (page: number) => void
  clearError: () => void
}

/**
 * Хук для управления списком компаний с поддержкой пагинации и Load More
 * Гибридный подход: данные в store, UI состояние локально
 */
export const useCompaniesList = ({
  sortType = SortType.POPULAR,
  sortOrder = SortOrder.DESC,
}: UseCompaniesListParams = {}): UseCompaniesListReturn => {
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    companies,
    pagination,
    isFetched,
    sortCompanies,
    loadMoreCompanies: loadMoreCompaniesStore,
  } = useCompaniesStore()

  const currentPage = pagination?.currentPage ?? 0
  const totalPages = pagination?.totalPages ?? 0

  const loadCompanies = useCallback(
    async (page: number) => {
      setIsLoadingPage(true)
      setError(null)

      try {
        await sortCompanies({
          type: sortType,
          param: sortOrder,
          page,
          size: PAGE_SIZE,
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка загрузки компаний'
        setError(errorMessage)
      } finally {
        setIsLoadingPage(false)
      }
    },
    [sortType, sortOrder, sortCompanies]
  )

  /**
   * Загрузить следующую страницу (аккумуляция)
   * Используется для Load More
   */
  const loadMoreCompaniesHandler = useCallback(async () => {
    const nextPage = currentPage + 1

    if (nextPage >= totalPages) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      await loadMoreCompaniesStore({
        type: sortType,
        param: sortOrder,
        page: nextPage,
        size: PAGE_SIZE,
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки компаний'
      setError(errorMessage)
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, totalPages, sortType, sortOrder, loadMoreCompaniesStore])

  /**
   * Обработчик смены страницы для Pagination
   * Принимает 0-based индекс страницы
   */
  const handlePageChange = useCallback(
    (page: number) => {
      loadCompanies(page)
    },
    [loadCompanies]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const hasMore = currentPage < totalPages - 1

  return {
    companies: companies as CompanyWithCountFeedbacksDto[],
    currentPage,
    totalPages,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    loadCompanies,
    loadMoreCompanies: loadMoreCompaniesHandler,
    handlePageChange,
    clearError,
  }
}

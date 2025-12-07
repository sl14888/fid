'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCompanyById } from '@/lib/api/companies.api'
import { getFeedbacksByCompanyId } from '@/lib/api/feedbacks.api'
import type { CompanyWithFeedbacksDto } from '@/types/company.types'
import type { FeedbackDto } from '@/types/feedback.types'
import type { Page } from '@/types/api.types'

const PAGE_SIZE = 8

interface UseCompanyPageReturn {
  company: CompanyWithFeedbacksDto | null
  feedbacks: FeedbackDto[]
  currentPage: number
  totalPages: number
  isLoadingCompany: boolean
  isLoadingFeedbacks: boolean
  isLoadingMore: boolean
  isFetched: boolean
  error: string | null
  hasMore: boolean
  handlePageChange: (page: number) => void
  handleLoadMore: () => Promise<void>
  retry: () => void
}

/**
 * Хук для управления страницей компании
 * Объединяет загрузку компании, отзывов, пагинацию и Load More
 */
export const useCompanyPage = (companyId: number): UseCompanyPageReturn => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Состояния для компании
  const [company, setCompany] = useState<CompanyWithFeedbacksDto | null>(null)
  const [isLoadingCompany, setIsLoadingCompany] = useState(false)

  // Состояния для отзывов
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([])
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isFetched, setIsFetched] = useState(false)

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Общее состояние ошибки
  const [error, setError] = useState<string | null>(null)

  // Флаги для управления поведением
  const isLoadMoreAction = useRef(false)
  const shouldScrollAfterLoad = useRef(false)

  // Извлекаем номер страницы из URL (1-based) и конвертируем в 0-based
  const pageFromUrl = searchParams.get('page')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  /**
   * Загрузить компанию по ID
   */
  const loadCompany = useCallback(async () => {
    if (!companyId || companyId <= 0) {
      setError('Некорректный ID компании')
      return
    }

    setIsLoadingCompany(true)
    setError(null)

    try {
      const companyData = await getCompanyById(companyId)
      setCompany(companyData)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки компании'
      setError(errorMessage)
    } finally {
      setIsLoadingCompany(false)
    }
  }, [companyId])

  /**
   * Загрузить отзывы компании (замена данных)
   */
  const loadFeedbacks = useCallback(
    async (page: number) => {
      if (!companyId || companyId <= 0) {
        return
      }

      setIsLoadingFeedbacks(true)
      setError(null)

      try {
        const response: Page<FeedbackDto> = await getFeedbacksByCompanyId({
          companyId,
          page,
          size: PAGE_SIZE,
        })

        setFeedbacks(response.content)
        setCurrentPage(response.number)
        setTotalPages(response.totalPages)
        setIsFetched(true)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка загрузки отзывов'
        setError(errorMessage)
      } finally {
        setIsLoadingFeedbacks(false)
      }
    },
    [companyId]
  )

  /**
   * Загрузить следующую страницу отзывов (аккумуляция)
   * Используется для Load More
   */
  const loadMoreFeedbacks = useCallback(async () => {
    if (!companyId || companyId <= 0) {
      return
    }

    const nextPage = currentPage + 1

    if (nextPage >= totalPages) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      const response: Page<FeedbackDto> = await getFeedbacksByCompanyId({
        companyId,
        page: nextPage,
        size: PAGE_SIZE,
      })

      // Добавляем новые отзывы к существующим
      setFeedbacks((prev) => [...prev, ...response.content])
      setCurrentPage(response.number)
      setTotalPages(response.totalPages)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки отзывов'
      setError(errorMessage)
    } finally {
      setIsLoadingMore(false)
    }
  }, [companyId, currentPage, totalPages])

  /**
   * Обработчик клика на номер страницы в пагинации
   * Обновляет URL и включает автоскролл после загрузки
   */
  const handlePageChange = useCallback(
    (zeroBasedPage: number) => {
      shouldScrollAfterLoad.current = true
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', (zeroBasedPage + 1).toString())
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  /**
   * Обработчик кнопки "Загрузить ещё"
   * Добавляет данные к существующим, обновляет URL без скролла
   */
  const handleLoadMore = useCallback(async () => {
    const currentScrollY = window.scrollY
    isLoadMoreAction.current = true
    await loadMoreFeedbacks()

    const nextPage = currentPage + 1
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (nextPage + 1).toString())
    router.replace(`?${params.toString()}`, { scroll: false })

    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY)
    })
  }, [loadMoreFeedbacks, currentPage, searchParams, router])

  /**
   * Повторная попытка загрузки при ошибке
   */
  const retry = useCallback(() => {
    loadCompany()
    loadFeedbacks(currentPageZeroBased)
  }, [loadCompany, loadFeedbacks, currentPageZeroBased])

  // Загрузка компании при монтировании
  useEffect(() => {
    loadCompany()
  }, [loadCompany])

  // Загрузка отзывов при изменении URL
  // Пропускаем загрузку если это был Load More (данные уже добавлены)
  useEffect(() => {
    if (!isLoadMoreAction.current) {
      loadFeedbacks(currentPageZeroBased)
    }
    isLoadMoreAction.current = false
  }, [currentPageZeroBased, loadFeedbacks])

  // Автоматический скролл после загрузки данных
  // Срабатывает только если был клик на пагинацию
  useEffect(() => {
    if (
      !isLoadingFeedbacks &&
      isFetched &&
      shouldScrollAfterLoad.current &&
      typeof window !== 'undefined'
    ) {
      requestAnimationFrame(() => {
        const element = document.getElementById('company-feedbacks')
        if (element) {
          const offset = 100
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
        shouldScrollAfterLoad.current = false
      })
    }
  }, [isLoadingFeedbacks, isFetched])

  const hasMore = currentPage < totalPages - 1

  return {
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
  }
}

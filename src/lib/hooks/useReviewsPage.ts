import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useReviewsList } from './useReviewsList'
import { SortOrder, SortType } from '@/types/request.types'

interface UseReviewsPageParams {
  sortType?: SortType
  sortOrder?: SortOrder
  onScrollToSection?: () => void
}

/**
 * Хук для управления страницей с отзывами
 * Объединяет логику пагинации, URL параметров и скролла
 */
export const useReviewsPage = ({
  sortType = SortType.TIME,
  sortOrder = SortOrder.DESC,
  onScrollToSection,
}: UseReviewsPageParams = {}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Флаг для различения Load More от обычной загрузки страницы
  const isLoadMoreAction = useRef(false)
  // Флаг для определения нужен ли скролл после загрузки (только при клике на пагинацию)
  const shouldScrollAfterLoad = useRef(false)

  const reviewsData = useReviewsList({ sortType, sortOrder })

  // Извлекаем номер страницы из URL (1-based) и конвертируем в 0-based
  const pageFromUrl = searchParams.get('page')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  // При изменении URL загружаем соответствующую страницу
  // Пропускаем загрузку если это был Load More (данные уже добавлены)
  useEffect(() => {
    if (!isLoadMoreAction.current) {
      reviewsData.loadReviews(currentPageZeroBased)
    }
    isLoadMoreAction.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageZeroBased])

  // Автоматический скролл после загрузки данных
  // Срабатывает только если был клик на пагинацию (shouldScrollAfterLoad = true)
  useEffect(() => {
    if (
      !reviewsData.isLoadingPage &&
      reviewsData.isFetched &&
      shouldScrollAfterLoad.current &&
      onScrollToSection
    ) {
      requestAnimationFrame(() => {
        onScrollToSection()
        shouldScrollAfterLoad.current = false
      })
    }
  }, [reviewsData.isLoadingPage, reviewsData.isFetched, onScrollToSection])

  /**
   * Обработчик клика на номер страницы в пагинации
   * Обновляет URL и включает автоскролл после загрузки
   */
  const handlePageChange = (zeroBasedPage: number) => {
    shouldScrollAfterLoad.current = true
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (zeroBasedPage + 1).toString()) // Конвертируем в 1-based для URL
    router.push(`?${params.toString()}`)
  }

  /**
   * Обработчик кнопки "Загрузить ещё"
   * Добавляет данные к существующим, обновляет URL без скролла
   */
  const handleLoadMore = async () => {
    const currentScrollY = window.scrollY
    isLoadMoreAction.current = true // Блокируем повторную загрузку в useEffect
    await reviewsData.loadMoreReviews()

    // Обновляем URL без перезагрузки страницы
    const nextPage = reviewsData.currentPage + 1
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (nextPage + 1).toString())
    router.replace(`?${params.toString()}`, { scroll: false })

    // Восстанавливаем позицию скролла
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY)
    })
  }

  return {
    ...reviewsData,
    handlePageChange,
    handleLoadMore,
  }
}

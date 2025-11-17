import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCompaniesList } from './useCompaniesList'
import { SortOrder, SortType } from '@/types/request.types'

interface UseCompaniesPageParams {
  sortType?: SortType
  sortOrder?: SortOrder
  onScrollToSection?: () => void
}

/**
 * Хук для управления страницей с компаниями
 * Объединяет логику пагинации, URL параметров и скролла
 */
export const useCompaniesPage = ({
  sortType = SortType.POPULAR,
  sortOrder = SortOrder.DESC,
  onScrollToSection,
}: UseCompaniesPageParams = {}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isLoadMoreAction = useRef(false)
  const shouldScrollAfterLoad = useRef(false)

  const companiesData = useCompaniesList({ sortType, sortOrder })

  const pageFromUrl = searchParams.get('page')
  const searchQuery = searchParams.get('q')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  useEffect(() => {
    // Не загружаем компании если есть поисковый запрос (поиск обрабатывается на странице)
    if (searchQuery) {
      return
    }

    if (!isLoadMoreAction.current) {
      companiesData.loadCompanies(currentPageZeroBased)
    }
    isLoadMoreAction.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageZeroBased, searchQuery])

  useEffect(() => {
    if (
      !companiesData.isLoadingPage &&
      companiesData.isFetched &&
      shouldScrollAfterLoad.current &&
      onScrollToSection
    ) {
      requestAnimationFrame(() => {
        onScrollToSection()
        shouldScrollAfterLoad.current = false
      })
    }
  }, [companiesData.isLoadingPage, companiesData.isFetched, onScrollToSection])

  /**
   * Обработчик клика на номер страницы в пагинации
   * Обновляет URL и включает автоскролл после загрузки
   */
  const handlePageChange = (zeroBasedPage: number) => {
    shouldScrollAfterLoad.current = true
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (zeroBasedPage + 1).toString())
    router.push(`?${params.toString()}`)
  }

  /**
   * Обработчик кнопки "Загрузить ещё"
   * Добавляет данные к существующим, обновляет URL без скролла
   */
  const handleLoadMore = async () => {
    const currentScrollY = window.scrollY
    isLoadMoreAction.current = true
    await companiesData.loadMoreCompanies()

    const nextPage = companiesData.currentPage + 1
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (nextPage + 1).toString())
    router.replace(`?${params.toString()}`, { scroll: false })

    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY)
    })
  }

  return {
    ...companiesData,
    handlePageChange,
    handleLoadMore,
  }
}

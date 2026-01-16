import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminReviewsList } from './useAdminReviewsList'

interface UseAdminReviewsPageParams {
  onScrollToSection?: () => void
}

/**
 * Хук для управления страницей с отзывами админа
 * Объединяет логику пагинации, URL параметров и скролла
 */
export const useAdminReviewsPage = ({
  onScrollToSection,
}: UseAdminReviewsPageParams = {}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isLoadMoreAction = useRef(false)
  const shouldScrollAfterLoad = useRef(false)

  const reviewsData = useAdminReviewsList()

  const pageFromUrl = searchParams.get('page')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  useEffect(() => {
    if (!isLoadMoreAction.current) {
      reviewsData.loadReviews(currentPageZeroBased)
    }
    isLoadMoreAction.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageZeroBased])

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

  const handlePageChange = (zeroBasedPage: number) => {
    shouldScrollAfterLoad.current = true
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (zeroBasedPage + 1).toString())
    router.push(`?${params.toString()}`)
  }

  const handleLoadMore = async () => {
    const currentScrollY = window.scrollY
    isLoadMoreAction.current = true
    await reviewsData.loadMoreReviews()

    const nextPage = reviewsData.currentPage + 1
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (nextPage + 1).toString())
    router.replace(`?${params.toString()}`, { scroll: false })

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

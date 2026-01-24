import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUsersList } from './useUsersList'

interface UseUsersPageParams {
  onScrollToSection?: () => void
}

/**
 * Хук для управления страницей пользователей
 * Объединяет логику пагинации, URL параметров и скролла
 */
export const useUsersPage = ({
  onScrollToSection,
}: UseUsersPageParams = {}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isLoadMoreAction = useRef(false)
  const shouldScrollAfterLoad = useRef(false)

  const usersData = useUsersList()

  const pageFromUrl = searchParams.get('page')
  const searchQuery = searchParams.get('q')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  useEffect(() => {
    if (searchQuery) {
      return
    }

    if (!isLoadMoreAction.current) {
      usersData.loadUsers(currentPageZeroBased)
    }
    isLoadMoreAction.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageZeroBased, searchQuery])

  useEffect(() => {
    if (
      !usersData.isLoadingPage &&
      usersData.isFetched &&
      shouldScrollAfterLoad.current &&
      onScrollToSection
    ) {
      requestAnimationFrame(() => {
        onScrollToSection()
        shouldScrollAfterLoad.current = false
      })
    }
  }, [usersData.isLoadingPage, usersData.isFetched, onScrollToSection])

  const handlePageChange = (zeroBasedPage: number) => {
    shouldScrollAfterLoad.current = true
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (zeroBasedPage + 1).toString())
    router.push(`?${params.toString()}`)
  }

  const handleLoadMore = async () => {
    const currentScrollY = window.scrollY
    isLoadMoreAction.current = true
    await usersData.loadMoreUsers()

    const nextPage = usersData.currentPage + 1
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (nextPage + 1).toString())
    router.replace(`?${params.toString()}`, { scroll: false })

    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY)
    })
  }

  return {
    ...usersData,
    handlePageChange,
    handleLoadMore,
  }
}

'use client'

import { useState, useCallback } from 'react'
import { useUsersStore } from '@/store/users.store'
import { UserSearchResultDto } from '@/types/user.types'

const PAGE_SIZE = 8

interface UseUsersListReturn {
  users: UserSearchResultDto[]
  currentPage: number
  totalPages: number
  totalElements: number
  isLoadingPage: boolean
  isLoadingMore: boolean
  isFetched: boolean
  error: string | null
  hasMore: boolean
  loadUsers: (page: number) => Promise<void>
  loadMoreUsers: () => Promise<void>
  handlePageChange: (page: number) => void
  clearError: () => void
}

/**
 * Хук для управления списком пользователей с поддержкой пагинации и Load More
 */
export const useUsersList = (): UseUsersListReturn => {
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    users,
    pagination,
    isFetchedUsers: isFetched,
    loadUsers: loadUsersStore,
    loadMoreUsers: loadMoreUsersStore,
  } = useUsersStore()

  const currentPage = pagination?.currentPage ?? 0
  const totalPages = pagination?.totalPages ?? 0
  const totalElements = pagination?.totalElements ?? 0

  const loadUsers = useCallback(
    async (page: number) => {
      setIsLoadingPage(true)
      setError(null)

      try {
        await loadUsersStore(page, PAGE_SIZE)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка загрузки пользователей'
        setError(errorMessage)
      } finally {
        setIsLoadingPage(false)
      }
    },
    [loadUsersStore]
  )

  const loadMoreUsersHandler = useCallback(async () => {
    const nextPage = currentPage + 1

    if (nextPage >= totalPages) {
      return
    }

    setIsLoadingMore(true)
    setError(null)

    try {
      await loadMoreUsersStore(nextPage, PAGE_SIZE)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки пользователей'
      setError(errorMessage)
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, totalPages, loadMoreUsersStore])

  const handlePageChange = useCallback(
    (page: number) => {
      loadUsers(page)
    },
    [loadUsers]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const hasMore = currentPage < totalPages - 1

  return {
    users,
    currentPage,
    totalPages,
    totalElements,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    loadUsers,
    loadMoreUsers: loadMoreUsersHandler,
    handlePageChange,
    clearError,
  }
}

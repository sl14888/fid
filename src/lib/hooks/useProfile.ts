'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { useUsersStore } from '@/store/users.store'
import toast from 'react-hot-toast'

const PAGE_SIZE = 4

export const useProfile = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { user, logout, setUser } = useAuthStore()
  const {
    feedbacks,
    pagination,
    isLoading: isLoadingFeedbacks,
    isFetched,
    error: feedbacksError,
    fetchFeedbacksByUserEmail,
    loadMoreUserFeedbacks,
    clearError: clearFeedbacksError,
    reset: resetFeedbacks,
  } = useFeedbacksStore()

  const {
    currentUser,
    isLoading: isLoadingUser,
    fetchUserByEmail,
    updateEmail,
  } = useUsersStore()

  const isLoadMoreActionRef = useRef(false)

  // Получаем страницу из URL
  const pageFromUrl = searchParams.get('page')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  // Загрузка данных пользователя при монтировании
  useEffect(() => {
    resetFeedbacks()

    if (user?.email) {
      fetchUserByEmail(user.email)
    }
  }, [user?.email, fetchUserByEmail, resetFeedbacks])

  // Загрузка отзывов после получения email
  useEffect(() => {
    if (user?.email && !isLoadMoreActionRef.current) {
      fetchFeedbacksByUserEmail({
        userEmail: user.email,
        page: currentPageZeroBased,
        size: PAGE_SIZE,
      })
    }
    isLoadMoreActionRef.current = false
  }, [user?.email, currentPageZeroBased, fetchFeedbacksByUserEmail])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSaveEmail = async (newEmail: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Пользователь не найден')
      return false
    }

    if (newEmail === (currentUser?.mail || user.email)) {
      toast.error('Новый email совпадает с текущим')
      return false
    }

    try {
      await updateEmail(user.id, { newEmail })
      setUser({ ...user, email: newEmail })
      toast.success('Email успешно обновлен')
      return true
    } catch {
      return false
    }
  }

  const handleReviewClick = (feedbackId: number) => {
    router.push(`/reviews/${feedbackId}`)
  }

  const handlePageChange = (zeroBasedPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (zeroBasedPage + 1).toString())
    router.push(`?${params.toString()}`)
  }

  const handleLoadMore = async () => {
    if (!user?.email || !pagination) return

    const currentScrollY = window.scrollY
    isLoadMoreActionRef.current = true

    const nextPage = pagination.currentPage + 1
    await loadMoreUserFeedbacks({
      userEmail: user.email,
      page: nextPage,
      size: PAGE_SIZE,
    })

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (nextPage + 1).toString())
    router.replace(`?${params.toString()}`, { scroll: false })

    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY)
    })
  }

  const handleRetry = () => {
    if (user?.email) {
      fetchUserByEmail(user.email)
      fetchFeedbacksByUserEmail({
        userEmail: user.email,
        page: currentPageZeroBased,
        size: PAGE_SIZE,
      })
    }
  }

  const hasMore = pagination
    ? pagination.currentPage < pagination.totalPages - 1
    : false

  return {
    // Data
    user,
    currentUser,
    feedbacks,
    pagination,

    // Loading states
    isLoadingUser,
    isLoadingFeedbacks,
    isFetched,

    // Errors
    feedbacksError,

    // Handlers
    handleLogout,
    handleSaveEmail,
    handleReviewClick,
    handlePageChange,
    handleLoadMore,
    handleRetry: () => {
      clearFeedbacksError()
      handleRetry()
    },

    // Computed
    hasMore,
  }
}

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

  const { user, logout, setUser, refreshTokens } = useAuthStore()
  const {
    feedbacks,
    pagination,
    isLoading: isLoadingFeedbacks,
    isFetched,
    error: feedbacksError,
    fetchFeedbacksByUserId,
    loadMoreUserFeedbacks,
    clearError: clearFeedbacksError,
    reset: resetFeedbacks,
  } = useFeedbacksStore()

  const {
    currentUser,
    isLoading: isLoadingUser,
    fetchUserById,
    updateProfile,
  } = useUsersStore()

  const isLoadMoreActionRef = useRef(false)

  // Получаем страницу из URL
  const pageFromUrl = searchParams.get('page')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  // Загрузка данных пользователя при монтировании
  useEffect(() => {
    resetFeedbacks()

    if (user?.id) {
      fetchUserById(user.id)
    }
  }, [user?.id, fetchUserById, resetFeedbacks])

  // Загрузка отзывов после получения ID
  useEffect(() => {
    if (user?.id && !isLoadMoreActionRef.current) {
      fetchFeedbacksByUserId({
        userId: user.id,
        page: currentPageZeroBased,
        size: PAGE_SIZE,
      })
    }
    isLoadMoreActionRef.current = false
  }, [user?.id, currentPageZeroBased, fetchFeedbacksByUserId])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSaveProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Пользователь не найден')
      return false
    }

    const emailChanged = email !== (currentUser?.mail || user.email)

    try {
      await updateProfile({ name, mail: email })

      if (emailChanged) {
        const refreshSuccess = await refreshTokens()

        if (!refreshSuccess) {
          throw new Error('Не удалось обновить токены')
        }

        if (currentUser) {
          setUser({
            ...user,
            email: currentUser.mail,
            role: currentUser.role,
          })
        }
      }

      toast.success('Профиль успешно обновлён')
      return true
    } catch (error) {
      toast.error('Ошибка при обновлении профиля')
      console.error(error)

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
    if (!user?.id || !pagination) return

    const currentScrollY = window.scrollY
    isLoadMoreActionRef.current = true

    const nextPage = pagination.currentPage + 1
    await loadMoreUserFeedbacks({
      userId: user.id,
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
    if (user?.id) {
      fetchUserById(user.id)
      fetchFeedbacksByUserId({
        userId: user.id,
        page: currentPageZeroBased,
        size: PAGE_SIZE,
      })
    }
  }

  const hasMore = pagination
    ? pagination.currentPage < pagination.totalPages - 1
    : false

  return {
    user,
    currentUser,
    feedbacks,
    pagination,
    isLoadingUser,
    isLoadingFeedbacks,
    isFetched,
    feedbacksError,
    handleLogout,
    handleSaveProfile,
    handleReviewClick,
    handlePageChange,
    handleLoadMore,
    handleRetry: () => {
      clearFeedbacksError()
      handleRetry()
    },
    hasMore,
  }
}

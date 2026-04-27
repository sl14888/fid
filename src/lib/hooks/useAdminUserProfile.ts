'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { useUsersStore } from '@/store/users.store'
import toast from 'react-hot-toast'

const PAGE_SIZE = 4

export const useAdminUserProfile = (userId: number) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { user } = useAuthStore()
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
    adminIsUploadingAvatar,
    adminIsUpdatingProfile,
    adminIsTogglingBan,
    fetchUserById,
    adminUpdateUserProfile,
    adminUploadUserAvatar,
    adminToggleUserBan,
    clearCurrentUser,
  } = useUsersStore()

  const isLoadMoreActionRef = useRef(false)

  const pageFromUrl = searchParams.get('page')
  const pageNumberFromUrl = pageFromUrl ? parseInt(pageFromUrl, 10) : 1
  const currentPageZeroBased = pageNumberFromUrl - 1

  useEffect(() => {
    resetFeedbacks()
    clearCurrentUser()
    fetchUserById(userId)
  }, [userId, fetchUserById, resetFeedbacks, clearCurrentUser])

  useEffect(() => {
    if (!isLoadMoreActionRef.current) {
      fetchFeedbacksByUserId({
        userId,
        page: currentPageZeroBased,
        size: PAGE_SIZE,
      })
    }
    isLoadMoreActionRef.current = false
  }, [userId, currentPageZeroBased, fetchFeedbacksByUserId])

  const handleSaveProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      await adminUpdateUserProfile(userId, { name, mail: email })
      toast.success('Профиль успешно обновлён')
      return true
    } catch {
      return false
    }
  }

  const handleUploadAvatar = async (file: File): Promise<boolean> => {
    return adminUploadUserAvatar(userId, file)
  }

  const handleToggleBan = async (): Promise<void> => {
    const newBanStatus = !currentUser?.banned
    try {
      await adminToggleUserBan(userId, newBanStatus)
      toast.success(newBanStatus ? 'Пользователь заблокирован' : 'Пользователь разблокирован')
    } catch {
      // interceptor показывает ошибку с бэка
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
    if (!pagination) return

    const currentScrollY = window.scrollY
    isLoadMoreActionRef.current = true

    const nextPage = pagination.currentPage + 1
    await loadMoreUserFeedbacks({
      userId,
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
    clearFeedbacksError()
    fetchUserById(userId)
    fetchFeedbacksByUserId({
      userId,
      page: currentPageZeroBased,
      size: PAGE_SIZE,
    })
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
    adminIsUploadingAvatar,
    adminIsUpdatingProfile,
    adminIsTogglingBan,
    isLoadingFeedbacks,
    isFetched,
    feedbacksError,
    handleSaveProfile,
    handleUploadAvatar,
    handleToggleBan,
    handleReviewClick,
    handlePageChange,
    handleLoadMore,
    handleRetry,
    hasMore,
  }
}

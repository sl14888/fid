'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heading2 } from '@/components/ui/Typography'
import { Badge, BadgeVariant, BadgeSize } from '@/components/ui/Badge'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { useAuthStore } from '@/store/auth.store'
import { EditReviewForm } from '@/components/forms/EditReviewForm'
import { Role } from '@/types/common.types'
import { NAV_LINKS } from '@/constants/navigation'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'
import styles from './page.module.scss'

interface EditReviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const feedbackId = Number(id)

  const { user, isAuthenticated } = useAuthStore()
  const {
    currentFeedback,
    fetchFeedbackById,
    clearCurrentFeedback,
    isLoading,
  } = useFeedbacksStore()

  const isInitializingAuth = !user && !isAuthenticated

  useEffect(() => {
    if (!isInitializingAuth && user && user.role !== Role.ADMIN) {
      router.push('/')
    }
  }, [user, isInitializingAuth, router])

  useEffect(() => {
    if (!isInitializingAuth && user && user.role === Role.ADMIN && feedbackId) {
      fetchFeedbackById(feedbackId)
    }

    return () => {
      clearCurrentFeedback()
    }
  }, [
    feedbackId,
    fetchFeedbackById,
    clearCurrentFeedback,
    isInitializingAuth,
    user,
  ])

  useEffect(() => {
    scrollIntoView()
  }, [])

  if (isInitializingAuth) {
    return null
  }

  if (!user || user.role !== Role.ADMIN) {
    return null
  }

  const handleSuccess = () => {
    router.push(NAV_LINKS.ADMIN_REVIEWS.href)
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading2>Редактирование отзыва</Heading2>
        </div>
        <div className={styles.container}>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!currentFeedback) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Heading2>Отзыв не найден</Heading2>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Heading2>Отзыв</Heading2>
          <Badge
            text={currentFeedback.onView === false ? 'Скрыт' : 'Опубликован'}
            size={BadgeSize.Medium}
          />
        </div>
      </div>

      <div className={styles.container}>
        <EditReviewForm
          feedbackId={feedbackId}
          initialData={currentFeedback}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}

'use client'

import { use, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Heading2, TextLRegular } from '@/components/ui/Typography'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Badge, BadgeVariant, BadgeSize } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { ReviewCard } from '@/components/ReviewCard'
import { ProfileForm, ProfileFormSkeleton } from '@/components/ProfileForm'
import { ProfileAvatar } from '@/components/ProfileAvatar'
import { useAdminUserProfile, useMediaQuery } from '@/lib/hooks'
import { useAuthStore } from '@/store/auth.store'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'
import { BREAKPOINTS } from '@/constants/breakpoints'
import { Role } from '@/types/common.types'
import styles from './page.module.scss'

interface AdminUserProfilePageProps {
  params: Promise<{ id: string }>
}

export default function AdminUserProfilePage({
  params,
}: AdminUserProfilePageProps) {
  const { id } = use(params)
  const userId = parseInt(id, 10)
  const router = useRouter()
  const feedbacksSectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const { user, isInitializing } = useAuthStore()

  const {
    currentUser,
    feedbacks,
    pagination,
    isLoadingUser,
    adminIsUploadingAvatar,
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
  } = useAdminUserProfile(userId)

  useEffect(() => {
    scrollIntoView()
  }, [])

  useEffect(() => {
    if (!isInitializing && user?.role !== Role.ADMIN) {
      router.push('/')
    }
  }, [user, isInitializing, router])

  if (isInitializing || user?.role !== Role.ADMIN) {
    return null
  }

  const renderFeedbacksContent = () => {
    if (feedbacksError) {
      return (
        <div className={styles.userProfilePage__errorState}>
          <TextLRegular>{feedbacksError}</TextLRegular>
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={handleRetry}
          >
            Попробовать снова
          </Button>
        </div>
      )
    }

    if (isFetched && (!feedbacks || feedbacks.length === 0)) {
      return (
        <div className={styles.userProfilePage__emptyState}>
          <TextLRegular className={styles.userProfilePage__emptyText}>
            У пользователя пока нет отзывов
          </TextLRegular>
        </div>
      )
    }

    return (
      <>
        <div className={styles.userProfilePage__feedbacksList}>
          {(!isFetched || isLoadingFeedbacks) &&
            Array.from({ length: 4 }).map((_, index) => (
              <ReviewCard
                key={index}
                variant="company"
                feedback={{}}
                loading
                fluid
              />
            ))}

          {isFetched &&
            !isLoadingFeedbacks &&
            feedbacks &&
            feedbacks.map((feedback) => (
              <ReviewCard
                key={feedback.id}
                variant="company"
                feedback={feedback}
                fluid
                onReadMore={() => feedback.id && handleReviewClick(feedback.id)}
              />
            ))}
        </div>

        {isFetched && pagination && pagination.totalPages > 1 && (
          <div className={styles.userProfilePage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingFeedbacks}
                disabled={isLoadingFeedbacks}
                className={styles.userProfilePage__loadMore}
              >
                Загрузить ещё
              </Button>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              disabled={isLoadingFeedbacks}
              className={styles.userProfilePage__pagination}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <div className={styles.userProfilePage}>
      <section className={styles.userProfilePage__header}>
        <Heading2>Профиль пользователя</Heading2>
      </section>

      <section>
        <div className={styles.userProfilePage__profileCard}>
          <div className={styles.userProfilePage__profileInfo}>
            {isLoadingUser && !currentUser ? (
              <ProfileFormSkeleton />
            ) : (
              <ProfileForm
                name={currentUser?.name ?? undefined}
                email={currentUser?.mail ?? ''}
                isEmailVerified={
                  currentUser?.role === Role.VERIFIED_USER ||
                  currentUser?.role === Role.ADMIN
                }
                onSaveProfile={handleSaveProfile}
                isSaving={false}
                onBan={handleToggleBan}
                isBanning={adminIsTogglingBan}
                isBanned={currentUser?.banned ?? false}
              />
            )}
          </div>

          <div className={styles.userProfilePage__profileAvatar}>
            {currentUser?.banned && (
              <Badge
                text="Заблокирован"
                variant={BadgeVariant.Neutral}
                size={BadgeSize.Medium}
                pill
                className={styles.userProfilePage__bannedBadge}
              />
            )}
            <ProfileAvatar
              avatarUrl={currentUser?.avatar ?? undefined}
              initials={currentUser?.name ?? currentUser?.mail ?? ''}
              onUpload={handleUploadAvatar}
              isUploading={adminIsUploadingAvatar}
            />
          </div>
        </div>
      </section>

      <section
        className={styles.userProfilePage__feedbacksSection}
        ref={feedbacksSectionRef}
        id="user-feedbacks"
      >
        <Heading2 className={styles.userProfilePage__feedbacksTitle}>
          Отзывы пользователя
        </Heading2>

        {renderFeedbacksContent()}
      </section>
    </div>
  )
}

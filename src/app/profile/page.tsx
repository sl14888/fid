'use client'

import { useEffect, useRef } from 'react'
import { Heading2, TextLRegular } from '@/components/ui/Typography'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { ReviewCard } from '@/components/ReviewCard'
import { ProfileForm, ProfileFormSkeleton } from '@/components/ProfileForm'
import { ProfileAvatar } from '@/components/ProfileAvatar'
import { useProfile, useMediaQuery } from '@/lib/hooks'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'
import { BREAKPOINTS } from '@/constants/breakpoints'
import styles from './page.module.scss'

/**
 * Страница профиля пользователя
 * Защищена middleware - доступна только авторизованным пользователям
 */
export default function ProfilePage() {
  const feedbacksSectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const {
    user,
    currentUser,
    feedbacks,
    pagination,
    isLoadingUser,
    isLoadingFeedbacks,
    isFetched,
    feedbacksError,
    handleLogout,
    handleSaveEmail,
    handleReviewClick,
    handlePageChange,
    handleLoadMore,
    handleRetry,
    hasMore,
  } = useProfile()

  useEffect(() => {
    scrollIntoView()
  }, [])

  if (!user) {
    return null
  }

  const renderFeedbacksContent = () => {
    if (feedbacksError) {
      return (
        <div className={styles.profilePage__errorState}>
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
        <div className={styles.profilePage__emptyState}>
          <TextLRegular className={styles.profilePage__emptyText}>
            У вас пока нет отзывов
          </TextLRegular>
        </div>
      )
    }

    return (
      <>
        <div className={styles.profilePage__feedbacksList}>
          {(!isFetched || isLoadingFeedbacks) &&
            Array.from({ length: 4 }).map((_, index) => (
              <ReviewCard
                key={index}
                variant="company"
                feedback={{} as any}
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
          <div className={styles.profilePage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingFeedbacks}
                disabled={isLoadingFeedbacks}
                className={styles.profilePage__loadMore}
              >
                Загрузить ещё
              </Button>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              disabled={isLoadingFeedbacks}
              className={styles.profilePage__pagination}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <div className={styles.profilePage}>
      <section className={styles.profilePage__header}>
        <Heading2>Профиль</Heading2>
      </section>

      <section>
        <div className={styles.profilePage__profileCard}>
          <div className={styles.profilePage__profileInfo}>
            {isLoadingUser ? (
              <ProfileFormSkeleton />
            ) : (
              <ProfileForm
                name={currentUser?.name ?? undefined}
                email={currentUser?.mail || user.email}
                onLogout={handleLogout}
                onSaveEmail={handleSaveEmail}
                isSaving={isLoadingUser}
              />
            )}
          </div>

          <div className={styles.profilePage__profileAvatar}>
            <ProfileAvatar initials={currentUser?.name ?? user.email} />
          </div>
        </div>
      </section>

      <section
        className={styles.profilePage__feedbacksSection}
        ref={feedbacksSectionRef}
        id="user-feedbacks"
      >
        <Heading2 className={styles.profilePage__feedbacksTitle}>
          Ваши отзывы
        </Heading2>

        {renderFeedbacksContent()}
      </section>
    </div>
  )
}

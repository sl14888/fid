'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserListItem } from '@/components/UserListItem'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { Heading2, TextLRegular } from '@/components/ui/Typography'
import { SearchInput } from '@/components/ui/SearchInput'
import { useUsersPage, useScrollIntoView, useMediaQuery } from '@/lib/hooks'
import { useAuthStore } from '@/store/auth.store'
import { useUsersStore } from '@/store/users.store'
import { Role } from '@/types/common.types'
import { BREAKPOINTS } from '@/constants/breakpoints'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

import styles from './page.module.scss'

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const usersSectionRef = useRef<HTMLDivElement>(null)
  const scrollToUsers = useScrollIntoView(usersSectionRef)
  const queryFromUrl = searchParams.get('q') || ''
  const searchQueryRef = useRef(queryFromUrl)
  const [isSearching, setIsSearching] = useState(false)
  const [searchValue, setSearchValue] = useState(queryFromUrl)
  const [currentQuery, setCurrentQuery] = useState(queryFromUrl)
  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const { user } = useAuthStore()
  const { searchUsers, searchResults } = useUsersStore()

  const {
    users,
    currentPage,
    totalPages,
    totalElements,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    handlePageChange,
    handleLoadMore,
    clearError,
    loadUsers,
  } = useUsersPage({
    onScrollToSection: scrollToUsers,
  })

  useEffect(() => {
    scrollIntoView()
  }, [])

  useEffect(() => {
    if (user?.role !== Role.ADMIN) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    if (queryFromUrl) {
      searchQueryRef.current = queryFromUrl
      queueMicrotask(() => {
        setSearchValue(queryFromUrl)
        setCurrentQuery(queryFromUrl)
        setIsSearching(true)
      })
      searchUsers(queryFromUrl)
        .catch((err) => console.error('Ошибка поиска:', err))
        .finally(() => setIsSearching(false))
    }
  }, [queryFromUrl, searchUsers])

  const handleSearch = useCallback(
    async (value: string) => {
      searchQueryRef.current = value
      setSearchValue(value)

      if (!value.trim()) {
        router.push('/users')
        setCurrentQuery('')
        return
      }

      const params = new URLSearchParams()
      params.set('q', value.trim())
      router.push(`/users?${params.toString()}`)
      setCurrentQuery(value.trim())
    },
    [router]
  )

  if (user?.role !== Role.ADMIN) {
    return null
  }

  const displayedUsers = currentQuery ? searchResults : users

  const renderContent = () => {
    if (error) {
      return (
        <div className={styles.usersPage__errorState}>
          <TextLRegular>{error}</TextLRegular>
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={() => {
              clearError()
              loadUsers(0)
            }}
          >
            Попробовать снова
          </Button>
        </div>
      )
    }

    if (isFetched && !isSearching && (!displayedUsers || displayedUsers.length === 0)) {
      return (
        <div className={styles.usersPage__emptyState}>
          <TextLRegular className={styles.usersPage__emptyText}>
            {currentQuery
              ? 'Пользователи не найдены. Попробуйте изменить поисковый запрос.'
              : 'Список пользователей пуст'}
          </TextLRegular>
        </div>
      )
    }

    return (
      <>
        <div className={styles.usersPage__list}>
          {(!isFetched || isLoadingPage || isSearching) &&
            Array.from({ length: 8 }).map((_, index) => (
              <UserListItem key={index} loading fluid />
            ))}

          {isFetched &&
            !isLoadingPage &&
            !isSearching &&
            displayedUsers &&
            displayedUsers.map((userItem) => (
              <UserListItem
                key={userItem.id}
                id={userItem.id}
                name={userItem.name}
                email={userItem.mail}
                avatarUrl={userItem.avatar}
                countFeedbacks={userItem.countFeedbacks}
                fluid
              />
            ))}
        </div>

        {isFetched && !currentQuery && (
          <div className={styles.usersPage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore || isLoadingPage}
                className={styles.usersPage__loadMore}
              >
                Загрузить ещё
              </Button>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={isLoadingPage}
                className={styles.usersPage__pagination}
              />
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <div className={styles.usersPage}>
      <section className={styles.usersPage__header}>
        <div className={styles.usersPage__headerContent}>
          <Heading2>
            Пользователи{' '}
            {isFetched && !currentQuery && totalElements > 0 && (
              <span className={styles.usersPage__count}>{totalElements}</span>
            )}
          </Heading2>
        </div>
      </section>

      <section
        className={styles.usersPage__content}
        ref={usersSectionRef}
      >
        <div>
          <div className={styles.usersPage__search}>
            <SearchInput
              placeholder="Поиск по email или id"
              onSearch={handleSearch}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fluid
            />
          </div>

          {renderContent()}
        </div>
      </section>
    </div>
  )
}

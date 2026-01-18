'use client'

import { FC, useState, useEffect } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { ModalSize } from '@/components/ui/Modal/Modal.types'
import { SearchInput } from '@/components/ui/SearchInput'
import {
  TextMRegular,
  LabelM,
  TextLMedium,
  Heading4,
} from '@/components/ui/Typography'
import { Spinner } from '@/components/ui/Spinner'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useUsersStore } from '@/store/users.store'
import type { UserSearchResultDto } from '@/types/user.types'
import { UserSearchResultItem } from './UserSearchResultItem/UserSearchResultItem'

import styles from './UserSearchModal.module.scss'

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUser: (user: UserSearchResultDto) => void
}

export const UserSearchModal: FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 500)

  const { searchResults, isSearching, searchUsers, clearSearchResults } =
    useUsersStore()

  const hasSearched = debouncedQuery.trim().length > 0
  const hasResults = searchResults && searchResults.length > 0

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchUsers(debouncedQuery)
    }
  }, [debouncedQuery, searchUsers])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchUsers(query.trim())
    }
  }

  const handleSelectUser = (user: UserSearchResultDto) => {
    onSelectUser(user)
    onClose()
    setSearchQuery('')
    clearSearchResults()
  }

  const handleClose = () => {
    onClose()
    setSearchQuery('')
    clearSearchResults()
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      size={ModalSize.Large}
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <Heading4 className={styles.title}>Поиск пользователя</Heading4>
        </div>

        <div className={styles.searchContainer}>
          <SearchInput
            className={styles.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            loading={isSearching}
            placeholder="Введите email или ID..."
            hideHelperTextArea
            fluid
          />
        </div>

        <div className={styles.resultsContainer}>
          {isSearching && (
            <div className={styles.loadingState}>
              <Spinner />
              <LabelM className={styles.loadingText}>Поиск...</LabelM>
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className={styles.emptyState}>
              <TextMRegular className={styles.emptyText}>
                Начните вводить email или ID пользователя для поиска
              </TextMRegular>
            </div>
          )}

          {!isSearching && hasSearched && !hasResults && (
            <div className={styles.notFoundState}>
              <TextLMedium className={styles.notFoundText}>
                Ничего не найдено
              </TextLMedium>
            </div>
          )}

          {!isSearching && hasSearched && hasResults && (
            <div className={styles.resultsList}>
              {searchResults.map((user) => (
                <UserSearchResultItem
                  key={user.id}
                  user={user}
                  onSelect={handleSelectUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

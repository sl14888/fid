'use client'

import { FC, useState, useEffect } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { ModalSize } from '@/components/ui/Modal/Modal.types'
import { SearchInput } from '../ui/SearchInput'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import {
  TextMRegular,
  LabelM,
  TextLMedium,
  Heading4,
} from '@/components/ui/Typography'
import { Spinner } from '@/components/ui/Spinner'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useCompaniesStore } from '@/store/companies.store'
import { CompanyWithCountFeedbacksDto } from '@/types/company.types'
import { CompanySearchResultItem } from './CompanySearchResultItem/CompanySearchResultItem'

import styles from './CompanySearchModal.module.scss'

interface CompanySearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCompany: (company: CompanyWithCountFeedbacksDto) => void
  onAddNewCompany: () => void
}

export const CompanySearchModal: FC<CompanySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCompany,
  onAddNewCompany,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 500)

  const { companies, isLoading, searchCompanies } = useCompaniesStore()

  const hasSearched = debouncedQuery.trim().length > 0
  const hasResults = companies && companies.length > 0

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchCompanies(debouncedQuery)
    }
  }, [debouncedQuery])

  const handleSelectCompany = (company: CompanyWithCountFeedbacksDto) => {
    onSelectCompany(company)
    onClose()
    setSearchQuery('')
  }

  const handleAddNewCompany = () => {
    onAddNewCompany()
    onClose()
    setSearchQuery('')
  }

  const handleClose = () => {
    onClose()
    setSearchQuery('')
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
          <Heading4 className={styles.title}>Поиск компании</Heading4>
          <Button
            text="Добавить компанию"
            variant={ButtonVariant.Primary}
            size={ButtonSize.Small}
            onClick={handleAddNewCompany}
            className={styles.addCompanyButton}
          />
        </div>

        <div className={styles.searchContainer}>
          <SearchInput
            className={styles.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите название компании..."
            hideHelperTextArea
            fluid
          />
        </div>

        <div className={styles.resultsContainer}>
          {isLoading && (
            <div className={styles.loadingState}>
              <Spinner />
              <LabelM className={styles.loadingText}>Поиск...</LabelM>
            </div>
          )}

          {!isLoading && !hasSearched && (
            <div className={styles.emptyState}>
              <TextMRegular className={styles.emptyText}>
                Начните вводить название компании для поиска
              </TextMRegular>
            </div>
          )}

          {!isLoading && hasSearched && !hasResults && (
            <div className={styles.notFoundState}>
              <TextLMedium className={styles.notFoundText}>
                Ничего не найдено
              </TextLMedium>
            </div>
          )}

          {!isLoading && hasSearched && hasResults && (
            <div className={styles.resultsList}>
              {(companies as CompanyWithCountFeedbacksDto[]).map((company) => (
                <CompanySearchResultItem
                  key={company.id}
                  company={company}
                  onSelect={handleSelectCompany}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

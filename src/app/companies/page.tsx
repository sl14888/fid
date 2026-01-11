'use client'

import {
  useRef,
  useCallback,
  useRef as useRefForQuery,
  useState,
  useEffect,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CompanyListItem } from '@/components/CompanyListItem'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { Heading2, TextLRegular } from '@/components/ui/Typography'
import { SearchInput } from '@/components/ui/SearchInput'
import { useCompaniesPage, useScrollIntoView, useMediaQuery } from '@/lib/hooks'
import { SortOrder, SortType } from '@/types/request.types'
import { useCompaniesStore } from '@/store/companies.store'
import { BREAKPOINTS } from '@/constants/breakpoints'

import styles from './page.module.scss'
import { IconName } from '@/components/ui/Icon'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

export default function CompaniesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const companiesSectionRef = useRef<HTMLDivElement>(null)
  const scrollToCompanies = useScrollIntoView(companiesSectionRef)
  const queryFromUrl = searchParams.get('q') || ''
  const searchQueryRef = useRefForQuery(queryFromUrl)
  const [isSearching, setIsSearching] = useState(false)
  const [searchValue, setSearchValue] = useState(queryFromUrl)
  const [currentQuery, setCurrentQuery] = useState(queryFromUrl)
  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

  const { searchCompanies } = useCompaniesStore()

  const {
    companies,
    currentPage,
    totalPages,
    isLoadingPage,
    isLoadingMore,
    isFetched,
    error,
    hasMore,
    handlePageChange,
    handleLoadMore,
    clearError,
    loadCompanies,
  } = useCompaniesPage({
    sortType: SortType.POPULAR,
    sortOrder: SortOrder.DESC,
    onScrollToSection: scrollToCompanies,
  })

  useEffect(() => {
    scrollIntoView()
  }, [])

  useEffect(() => {
    if (queryFromUrl) {
      searchQueryRef.current = queryFromUrl
      queueMicrotask(() => {
        setSearchValue(queryFromUrl)
        setCurrentQuery(queryFromUrl)
        setIsSearching(true)
      })
      searchCompanies(queryFromUrl)
        .catch((err) => console.error('Ошибка поиска:', err))
        .finally(() => setIsSearching(false))
    }
  }, [queryFromUrl, searchQueryRef])

  const handleAddCompany = () => {
    router.push('/reviews/new')
  }

  const handleSearch = useCallback(
    async (value: string) => {
      searchQueryRef.current = value
      setSearchValue(value)

      if (!value.trim()) {
        // Очищаем query параметр и загружаем обычный список
        router.push('/companies')
        return
      }

      // Обновляем URL с query параметром
      const params = new URLSearchParams()
      params.set('q', value.trim())
      router.push(`/companies?${params.toString()}`)
    },
    [router, searchQueryRef]
  )

  const handleCompanyClick = (companyId: number) => {
    router.push(`/companies/${companyId}`)
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className={styles.companiesPage__errorState}>
          <TextLRegular>{error}</TextLRegular>
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={() => {
              clearError()
              loadCompanies(0)
            }}
          >
            Попробовать снова
          </Button>
        </div>
      )
    }

    if (isFetched && !isSearching && (!companies || companies.length === 0)) {
      return (
        <div className={styles.companiesPage__emptyState}>
          <TextLRegular className={styles.companiesPage__emptyText}>
            {currentQuery
              ? 'Компании не найдены. Попробуйте изменить поисковый запрос.'
              : 'Список компаний пуст'}
          </TextLRegular>
        </div>
      )
    }

    return (
      <>
        <div className={styles.companiesPage__list}>
          {(!isFetched || isLoadingPage || isSearching) &&
            Array.from({ length: 8 }).map((_, index) => (
              <CompanyListItem key={index} loading fluid />
            ))}

          {isFetched &&
            !isLoadingPage &&
            !isSearching &&
            companies &&
            companies.map((company) => (
              <CompanyListItem
                key={company.id}
                displayName={company.name}
                description={company.employmentType?.description}
                companyAverageGrade={company.averageGrade}
                companyCountFeedbacks={company.countFeedbacks}
                logoUrl={company?.avatar}
                fluid
                onClick={() => handleCompanyClick(company.id)}
              />
            ))}
        </div>

        {isFetched && !currentQuery && (
          <div className={styles.companiesPage__controls}>
            {hasMore && (
              <Button
                variant={ButtonVariant.SecondaryGray}
                size={isMobile ? ButtonSize.Default : ButtonSize.Small}
                onClick={handleLoadMore}
                loading={isLoadingMore}
                disabled={isLoadingMore || isLoadingPage}
                className={styles.companiesPage__loadMore}
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
                className={styles.companiesPage__pagination}
              />
            )}
          </div>
        )}
      </>
    )
  }

  return (
    <div className={styles.companiesPage}>
      <section className={styles.companiesPage__header}>
        <div className={styles.companiesPage__headerContent}>
          <Heading2>Компании</Heading2>
          <Button
            variant={ButtonVariant.PrimaryBlack}
            size={ButtonSize.Small}
            onClick={handleAddCompany}
            iconLeft={IconName.Plus}
          >
            Добавить компанию
          </Button>
        </div>
      </section>

      <section
        className={styles.companiesPage__content}
        ref={companiesSectionRef}
      >
        <div>
          <div className={styles.companiesPage__search}>
            <SearchInput
              placeholder="Поиск по компаниям"
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

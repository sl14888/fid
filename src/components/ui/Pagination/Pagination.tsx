'use client'

import { FC, useMemo } from 'react'
import { Button } from '../Button'
import { ButtonSize, ButtonVariant } from '../Button/Button.types'
import { Icon } from '../Icon'
import { IconName, IconSize } from '../Icon/Icon.types'
import { generatePaginationElements } from '@/lib/utils'
import type { PaginationProps } from './Pagination.types'
import styles from './Pagination.module.scss'

const MAX_VISIBLE_PAGES = 4
const ELLIPSIS = '...'

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className = '',
}) => {
  if (totalPages < 1) return null
  if (currentPage < 0 || currentPage >= totalPages) return null

  const pageElements = useMemo(
    () =>
      generatePaginationElements(currentPage, totalPages, MAX_VISIBLE_PAGES),
    [currentPage, totalPages]
  )

  const handlePageChange = (zeroBasedPage: number) => {
    if (disabled || zeroBasedPage === currentPage) return
    if (zeroBasedPage < 0 || zeroBasedPage >= totalPages) return
    onPageChange(zeroBasedPage)
  }

  const handlePrevious = () => {
    handlePageChange(currentPage - 1)
  }

  const handleNext = () => {
    handlePageChange(currentPage + 1)
  }

  const isPrevDisabled = disabled || currentPage === 0
  const isNextDisabled = disabled || currentPage === totalPages - 1

  return (
    <nav
      className={`${styles.pagination} ${className}`}
      role="navigation"
      aria-label="Навигация по страницам"
    >
      <Button
        variant={ButtonVariant.SecondaryGray}
        size={ButtonSize.Small}
        disabled={isPrevDisabled}
        onClick={handlePrevious}
        className={styles.pagination__arrow}
        aria-label="Предыдущая страница"
      >
        <Icon
          name={IconName.ArrowLeft}
          size={IconSize.Small}
          height={24}
          width={24}
        />
      </Button>

      {pageElements.map((element, index) => {
        if (element.type === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={`${styles.pagination__ellipsis} `}
              aria-hidden="true"
            >
              {ELLIPSIS}
            </span>
          )
        }

        const isActive = element.zeroBasedIndex === currentPage

        return (
          <Button
            key={element.zeroBasedIndex}
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            disabled={disabled}
            onClick={() => handlePageChange(element.zeroBasedIndex)}
            className={`${styles.pagination__page} ${
              isActive ? styles['pagination__page--active'] : ''
            }`}
            aria-label={`Страница ${element.displayValue}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {element.displayValue}
          </Button>
        )
      })}

      <Button
        variant={ButtonVariant.SecondaryGray}
        size={ButtonSize.Small}
        disabled={isNextDisabled}
        onClick={handleNext}
        className={styles.pagination__arrow}
        aria-label="Следующая страница"
      >
        <Icon name={IconName.ArrowRight} size={IconSize.Small} />
      </Button>
    </nav>
  )
}

'use client'

import { FC, useMemo } from 'react'
import { Button } from '../Button'
import { ButtonSize, ButtonVariant } from '../Button/Button.types'
import { Icon } from '../Icon'
import { IconName, IconSize } from '../Icon/Icon.types'
import type { PaginationProps } from './Pagination.types'
import styles from './Pagination.module.scss'

/**
 * Компонент пагинации для навигации по страницам
 */
export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 4,
  disabled = false,
  className = '',
}) => {
  if (totalPages < 1) return null
  if (currentPage < 1 || currentPage > totalPages) return null

  /**
   * Вычисляет массив видимых номеров страниц
   * Центрирует текущую страницу, если возможно
   */
  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: number[] = []
    const halfVisible = Math.floor(visiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + visiblePages - 1)

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }, [currentPage, totalPages, visiblePages])

  const handlePageChange = (page: number) => {
    if (disabled || page === currentPage) return
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  const handlePrevious = () => {
    handlePageChange(currentPage - 1)
  }

  const handleNext = () => {
    handlePageChange(currentPage + 1)
  }

  const isPrevDisabled = disabled || currentPage === 1
  const isNextDisabled = disabled || currentPage === totalPages

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

      {visiblePageNumbers.map((page) => {
        const isActive = page === currentPage

        return (
          <Button
            key={page}
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            disabled={disabled}
            onClick={() => handlePageChange(page)}
            className={`${styles.pagination__page} ${
              isActive ? styles['pagination__page--active'] : ''
            }`}
            aria-label={`Страница ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
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

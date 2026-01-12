'use client'

import { FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCompaniesStore } from '@/store/companies.store'
import { SmallCompanyCard } from '@/components/SmallCompanyCard'
import { Container } from '@/components/layout/Container'
import { useDragToScroll } from '@/lib/hooks'
import type { TopCompaniesProps } from './TopCompanies.types'
import styles from './TopCompanies.module.scss'

// Количество skeleton карточек при загрузке
const SKELETON_COUNT = 8

export const TopCompanies: FC<TopCompaniesProps> = ({ className = '' }) => {
  const router = useRouter()

  const { topCompanies, isLoading, error, fetchTopCompanies } =
    useCompaniesStore()

  const {
    containerRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleClick,
  } = useDragToScroll()

  useEffect(() => {
    fetchTopCompanies()
  }, [])

  const companiesList = Array.isArray(topCompanies) ? topCompanies : []

  if (error || (companiesList.length === 0 && !isLoading)) {
    return null
  }

  const handleCardClick = (companyId: number) => {
    router.push(`/companies/${companyId}`)
  }

  return (
    <Container className={className}>
      <div
        ref={containerRef}
        className={styles.topCompanies__scrollContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        data-dragging={isDragging}
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className={styles.topCompanies__item}
              >
                <SmallCompanyCard loading />
              </div>
            ))
          : companiesList.map((company) => (
              <div key={company.id} className={styles.topCompanies__item}>
                <SmallCompanyCard
                  companyName={company.name}
                  rating={company.averageGrade}
                  logoUrl={company.avatar}
                  onClick={(e) =>
                    handleClick(e, () => handleCardClick(company.id))
                  }
                />
              </div>
            ))}
      </div>
    </Container>
  )
}

'use client'

import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompaniesStore } from '@/store/companies.store'
import { SmallCompanyCard } from '@/components/SmallCompanyCard'
import { Container } from '@/components/layout/Container'
import { useMediaQuery } from '@/lib/hooks'
import type { TopCompaniesProps } from './TopCompanies.types'
import styles from './TopCompanies.module.scss'
import { BREAKPOINTS } from '@/constants/breakpoints'

const DESKTOP_COUNT = 6
const TABLET_COUNT = 4
const MOBILE_COUNT = 2

export const TopCompanies: FC<TopCompaniesProps> = ({ className = '' }) => {
  const router = useRouter()
  const isMobile = useMediaQuery(BREAKPOINTS.MD)
  const isTablet = useMediaQuery(BREAKPOINTS.LG)

  const { topCompanies, isLoading, error, fetchTopCompanies } =
    useCompaniesStore()

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

  const getCardsCount = () => {
    if (isMobile) return MOBILE_COUNT
    if (isTablet) return TABLET_COUNT
    return DESKTOP_COUNT
  }

  const cardsCount = getCardsCount()

  return (
    <Container className={className}>
      <div className={styles.topCompanies}>
        {isLoading
          ? Array.from({ length: cardsCount }).map((_, index) => (
              <SmallCompanyCard key={`skeleton-${index}`} loading />
            ))
          : companiesList
              .slice(0, cardsCount)
              .map((company) => (
                <SmallCompanyCard
                  key={company.id}
                  companyName={company.name}
                  rating={company.averageGrade}
                  logoUrl={company.avatar}
                  onClick={() => handleCardClick(company.id)}
                />
              ))}
      </div>
    </Container>
  )
}

'use client'

import { FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCompaniesStore } from '@/store/companies.store'
import { SmallCompanyCard } from '@/components/SmallCompanyCard'
import { Container } from '@/components/layout/Container'
import type { TopCompaniesProps } from './TopCompanies.types'
import styles from './TopCompanies.module.scss'

const SKELETON_COUNT = 8
const AUTOPLAY_DELAY = 1450

export const TopCompanies: FC<TopCompaniesProps> = ({ className = '' }) => {
  const router = useRouter()

  const { topCompanies, isLoading, error, fetchTopCompanies } =
    useCompaniesStore()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: 'start',
      breakpoints: {
        '(max-width: 767px)': { align: 'center', dragFree: false },
      },
    },
    [
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ]
  )

  useEffect(() => {
    fetchTopCompanies()
  }, [])

  const companiesList = Array.isArray(topCompanies) ? topCompanies : []

  if (error || (!isLoading && companiesList.length === 0)) return null

  const handleCompanyClick = (companyId: number) => {
    emblaApi?.plugins()?.autoplay?.stop()
    router.push(`/companies/${companyId}`)
  }

  return (
    <Container className={className}>
      <div ref={emblaRef} className={styles.embla}>
        <div className={styles.embla__container}>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div key={`skeleton-${index}`} className={styles.embla__slide}>
                  <SmallCompanyCard loading />
                </div>
              ))
            : companiesList.map((company) => (
                <div key={company.id} className={styles.embla__slide}>
                  <SmallCompanyCard
                    companyName={company.name}
                    rating={company.averageGrade}
                    logoUrl={company.avatar.url}
                    onClick={() => handleCompanyClick(company.id)}
                  />
                </div>
              ))}
        </div>
      </div>
    </Container>
  )
}

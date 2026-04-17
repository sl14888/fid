'use client'

import { FC, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { useCompaniesStore } from '@/store/companies.store'
import { SmallCompanyCard } from '@/components/SmallCompanyCard'
import { Container } from '@/components/layout/Container'
import { navigateToCompany } from '@/lib/utils/company-url'
import type { TopCompaniesProps } from './TopCompanies.types'
import styles from './TopCompanies.module.scss'

const SKELETON_COUNT = 8
const SCROLL_SPEED = 1.5

export const TopCompanies: FC<TopCompaniesProps> = ({ className = '' }) => {
  const router = useRouter()

  const { topCompanies, isLoading, error, fetchTopCompanies } =
    useCompaniesStore()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ speed: SCROLL_SPEED, startDelay: 0, stopOnMouseEnter: true, stopOnInteraction: false })]
  )

  useEffect(() => {
    fetchTopCompanies()
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    const autoScroll = emblaApi.plugins()?.autoScroll
    if (!autoScroll) return

    const resume = () => autoScroll.play()
    emblaApi.on('pointerUp', resume)
    return () => { emblaApi.off('pointerUp', resume) }
  }, [emblaApi])

  const companiesList = Array.isArray(topCompanies) ? topCompanies : []

  if (error || (!isLoading && companiesList.length === 0)) return null

  const handleCompanyClick = (company: { id: number; slug?: string | null }) => {
    emblaApi?.plugins()?.autoScroll?.stop()
    navigateToCompany(router, company)
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
                    onClick={() => handleCompanyClick(company)}
                  />
                </div>
              ))}
        </div>
      </div>
    </Container>
  )
}

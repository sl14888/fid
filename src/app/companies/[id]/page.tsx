import type { Metadata } from 'next'
import { serverFetchCompany } from '@/lib/api/server-fetch'
import { CompanyPageClient } from './CompanyPageClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://feedbacks.ru'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const companyId = Number(id)

  if (isNaN(companyId)) {
    return { title: 'Компания не найдена' }
  }

  const company = await serverFetchCompany(companyId)

  if (!company) {
    return {
      title: 'Компания',
      description: 'Информация о компании на платформе FID',
    }
  }

  const grade = company.averageGrade?.toFixed(1)
  const employmentDesc = company.employmentType?.description || ''
  const title = company.name
  const description = `Отзывы сотрудников о компании ${company.name}${employmentDesc ? ` (${employmentDesc})` : ''}. Средняя оценка ${grade} из 5 на платформе FID.`
  const canonicalUrl = `/companies/${companyId}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | FID`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} | FID`,
      description,
    },
  }
}

export default async function CompanyPage({ params }: Props) {
  const { id } = await params
  const companyId = Number(id)
  const company = await serverFetchCompany(companyId)

  const jsonLd = company
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: company.name,
        url: company.website || `${SITE_URL}/companies/${companyId}`,
        ...(company.averageGrade > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: company.averageGrade,
            bestRating: 5,
            worstRating: 1,
            reviewCount: company.countFeedbacks || 1,
          },
        }),
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CompanyPageClient companyId={companyId} />
    </>
  )
}

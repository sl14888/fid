import type { Metadata } from 'next'
import type { CompanyWithFeedbacksDto } from '@/types/company.types'
import type { FeedbackDto } from '@/types/feedback.types'
import { GLOBAL_KEYWORDS } from '@/constants/seo'

export function buildCompanyPageMetadata(
  company: CompanyWithFeedbacksDto,
  slug: string | null,
  companyId: number
): Metadata {
  const grade = company.averageGrade?.toFixed(1)
  const employmentDesc = company.employmentType?.description || ''
  const typePart = employmentDesc ? ` (${employmentDesc})` : ''

  if (!slug) {
    const title = company.name
    const description = `Отзывы о компании ${company.name}${typePart}. Средняя оценка ${grade} из 5 на платформе FID.`
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
        images: [{ url: '/og-image.png', width: 454, height: 418, alt: 'FID' }],
      },
      twitter: {
        card: 'summary',
        title: `${title} | FID`,
        description,
        images: ['/og-image.png'],
      },
    }
  }

  const innPart = company.inn ? ` ИНН ${company.inn}` : ''
  const title = [
    `${company.name} — отзывы и рейтинг ${grade}/5`,
    employmentDesc,
    `${innPart} | FID #${companyId}`,
  ]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' ')

  const descriptionBase = `Отзывы о компании ${company.name}${typePart}. Средняя оценка ${grade}/5. Плюсы и минусы, реальный опыт клиентов и проверенные отзывы о качестве услуг.`
  const description = company.website
    ? `${descriptionBase} Официальный сайт: ${company.website}`
    : descriptionBase

  const canonicalUrl = `/companies/${slug}/${companyId}`

  return {
    title: { absolute: title },
    description,
    keywords: GLOBAL_KEYWORDS,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: '/og-image.png', width: 454, height: 418, alt: 'FID' }],
    },
    twitter: { card: 'summary', title, description, images: ['/og-image.png'] },
  }
}

export function buildReviewPageMetadata(review: FeedbackDto): Metadata {
  const companyName = review.companyName || 'компании'
  const text = review.description || review.pluses || ''
  const textShort = text.length > 50 ? `${text.slice(0, 50)}...` : text

  const title = text
    ? `Отзыв о ${companyName}: ${textShort} | FID #${review.id}`
    : `Отзыв о ${companyName} | FID #${review.id}`

  const description = text
    ? `Отзыв о ${companyName}: ${text.slice(0, 120)}. Рейтинг ${review.grade}/5`
    : `Отзыв о ${companyName}. Рейтинг ${review.grade}/5`

  const canonicalUrl = `/reviews/${review.id}`

  return {
    title: { absolute: title },
    description,
    keywords: GLOBAL_KEYWORDS,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [{ url: '/og-image.png', width: 454, height: 418, alt: 'FID' }],
    },
    twitter: { card: 'summary', title, description, images: ['/og-image.png'] },
  }
}

import type { CompanyWithFeedbacksDto } from '@/types/company.types'
import type { FeedbackDto } from '@/types/feedback.types'
import { SITE_URL } from '@/constants/api'

export function buildOrganizationJsonLd(company: CompanyWithFeedbacksDto, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website || pageUrl,
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
}

export function buildReviewJsonLd(review: FeedbackDto) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: review.title || `Отзыв о компании ${review.companyName || ''}`,
    reviewBody: review.description || review.pluses || '',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.grade,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@type': 'Organization',
      name: review.companyName || 'Компания',
      url: review.companyId ? `${SITE_URL}/companies/${review.companyId}` : undefined,
    },
    author: {
      '@type': 'Person',
      name: review.userName || 'Аноним',
    },
    ...(review.createdTime && { datePublished: review.createdTime }),
  }
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FID',
    url: SITE_URL,
    description: 'Платформа для реальных отзывов о компаниях',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/companies?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

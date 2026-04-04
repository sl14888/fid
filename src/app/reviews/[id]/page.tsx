import type { Metadata } from 'next'
import { serverFetchFeedback } from '@/lib/api/server-fetch'
import { ReviewPageClient } from './ReviewPageClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://feedbacks.ru'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const reviewId = Number(id)

  if (isNaN(reviewId)) {
    return { title: 'Отзыв не найден' }
  }

  const review = await serverFetchFeedback(reviewId)

  if (!review) {
    return {
      title: 'Отзыв',
      description: 'Отзыв о компании на платформе FID',
    }
  }

  const companyName = review.companyName || 'компании'
  const title = review.title || `Отзыв о компании ${companyName}`
  const rawDescription = review.description || review.pluses || ''
  const description = rawDescription.length > 0
    ? rawDescription.slice(0, 160)
    : `Отзыв сотрудника о компании ${companyName} на платформе FID.`
  const canonicalUrl = `/reviews/${review.id}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | FID`,
      description,
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${title} | FID`,
      description,
    },
  }
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params
  const reviewId = Number(id)
  const review = await serverFetchFeedback(reviewId)

  const jsonLd = review
    ? {
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
          name: review.userName || 'Анонимный сотрудник',
        },
        ...(review.createdTime && { datePublished: review.createdTime }),
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
      <ReviewPageClient reviewId={reviewId} />
    </>
  )
}

import type { Metadata } from 'next'
import { serverFetchFeedback } from '@/lib/api/server-fetch'
import { ReviewPageClient } from './ReviewPageClient'
import { buildReviewJsonLd } from '@/lib/utils/jsonld'
import { buildReviewPageMetadata } from '@/lib/utils/metadata'

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

  return buildReviewPageMetadata(review)
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params
  const reviewId = Number(id)
  const review = await serverFetchFeedback(reviewId)

  const jsonLd = review ? buildReviewJsonLd(review) : null

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

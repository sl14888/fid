import { FC } from 'react'
import Link from 'next/link'

import { Icon, IconName, IconSize } from '@/components/ui/Icon'

import styles from '../ReviewCard.module.scss'
import { PhotoStack } from '../PhotoStack'
import { FeedbackDto } from '@/types/feedback.types'

interface ReviewCardFooterProps {
  feedback: FeedbackDto
  hasPhotos?: boolean
  fullReview?: boolean
  onReadMore?: () => void
  showButton?: boolean
}

export const ReviewCardFooter: FC<ReviewCardFooterProps> = ({
  feedback,
  hasPhotos,
  fullReview,
  onReadMore,
  showButton = true,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onReadMore) {
      onReadMore()
    }
  }

  if (!showButton) {
    return null
  }

  return (
    <div className={styles.reviewCard__footer}>
      {hasPhotos && !fullReview && <PhotoStack photos={feedback.files!} />}
      <Link href="#" onClick={handleClick} className={styles.reviewCard__link}>
        Читать полностью
        <Icon
          name={IconName.ArrowRight}
          size={IconSize.Small}
          className={styles.icon}
        />
      </Link>
    </div>
  )
}

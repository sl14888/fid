import { FC } from 'react'
import Link from 'next/link'

import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'

import styles from '../ReviewCard.module.scss'
import { PhotoStack } from '../PhotoStack'
import { FeedbackDto } from '@/types/feedback.types'

interface ReviewCardFooterProps {
  feedback: FeedbackDto
  hasPhotos?: boolean
  fullReview?: boolean
  onReadMore?: () => void
  showButton?: boolean
  footerVariant?: 'default' | 'edit' | 'admin'
  actions?: {
    onEdit?: () => void
  }
}

export const ReviewCardFooter: FC<ReviewCardFooterProps> = ({
  feedback,
  hasPhotos,
  fullReview,
  onReadMore,
  showButton = true,
  footerVariant = 'default',
  actions,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onReadMore) {
      onReadMore()
    }
  }

  const handleEditClick = () => {
    actions?.onEdit?.()
  }

  if (footerVariant === 'admin') {
    return null
  }

  if (!showButton && footerVariant === 'default') {
    return null
  }

  if (footerVariant === 'edit') {
    return (
      <div className={styles.reviewCard__footer}>
        <div className={styles.reviewCard__footerEditButton}>
          <Button
            text="Редактировать отзыв"
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            onClick={handleEditClick}
          />
        </div>
      </div>
    )
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

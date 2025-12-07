import { FC } from 'react'
import clsx from 'clsx'

import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { TextS } from '@/components/ui/Typography'

import styles from '../ReviewCard.module.scss'

interface ReviewCardSectionProps {
  iconName: (typeof IconName)[keyof typeof IconName]
  text: string
  fullReview?: boolean
}

export const ReviewCardSection: FC<ReviewCardSectionProps> = ({
  iconName,
  text,
  fullReview = false,
}) => {
  return (
    <div className={styles.reviewCard__section}>
      <div className={styles.reviewCard__iconCircle}>
        <Icon name={iconName} size={IconSize.Small} color="#6E6E6E" />
      </div>
      <TextS
        className={clsx(
          styles.reviewCard__text,
          fullReview && styles['reviewCard__text--full']
        )}
      >
        {text}
      </TextS>
    </div>
  )
}

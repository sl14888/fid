import { FC } from 'react'

import { Avatar, AvatarSize, AvatarColor } from '@/components/ui/Avatar'
import { Rating, RatingSize } from '@/components/ui/Rating'
import { LabelS, LabelM, TextXS } from '@/components/ui/Typography'

import { formatDate } from '@/lib/utils/date'
import { getInitials } from '@/lib/utils/string'

import styles from '../ReviewCard.module.scss'

interface ReviewCardHeaderProps {
  variant: 'user' | 'company'
  displayName?: string | null
  dateString?: string | null
  grade?: number | null
  logoUrl?: string
}

export const ReviewCardHeader: FC<ReviewCardHeaderProps> = ({
  variant,
  displayName,
  dateString,
  grade,
  logoUrl,
}) => {
  return (
    <div className={styles.reviewCard__header}>
      <div className={styles.reviewCard__headerLeft}>
        {variant === 'user' ? (
          <Avatar
            initials={getInitials(displayName)}
            size={AvatarSize.XS}
            color={AvatarColor.Gray}
            src={logoUrl}
          />
        ) : (
          <div className={styles.reviewCard__companyLogo}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={displayName || 'Company logo'}
                className={styles.reviewCard__companyLogoImage}
              />
            ) : (
              <div className={styles.reviewCard__companyLogoPlaceholder}>
                {getInitials(displayName)}
              </div>
            )}
          </div>
        )}
        <div className={styles.reviewCard__info}>
          <LabelM className={styles.reviewCard__name}>
            {displayName || 'Аноним'}
          </LabelM>
          {dateString && (
            <TextXS className={styles.reviewCard__date}>
              {formatDate(dateString)}
            </TextXS>
          )}
        </div>
      </div>

      {grade !== null && grade !== undefined && (
        <div className={styles.reviewCard__rating}>
          <Rating value={grade} readonly size={RatingSize.Small} />
        </div>
      )}
    </div>
  )
}

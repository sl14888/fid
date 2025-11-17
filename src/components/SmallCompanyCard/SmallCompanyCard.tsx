import { FC } from 'react'

import { SmallCompanyCardProps } from './SmallCompanyCard.types'
import { TextLMedium, TextXS } from '@/components/ui/Typography'
import { SmallCompanyCardSkeleton } from './SmallCompanyCardSkeleton'

import styles from './SmallCompanyCard.module.scss'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { getInitials } from '@/lib/utils'

export const SmallCompanyCard: FC<SmallCompanyCardProps> = ({
  companyName = '',
  rating = 0,
  logoUrl,
  onClick,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return <SmallCompanyCardSkeleton className={className} />
  }

  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.company__logoWrapper}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName || 'Company logo'}
            className={styles.company__logo}
          />
        ) : (
          <div className={styles.company__logoInitials}>
            {getInitials(companyName)}
          </div>
        )}
      </div>

      <div className={styles.company__text}>
        <TextLMedium className={styles.company__name}>
          {companyName}
        </TextLMedium>

        <div className={styles.company__rating}>
          <TextXS className={styles.rating}>{rating.toFixed(1)}</TextXS>
          <Icon name={IconName.Star} size={IconSize.Small} color="#d8d8d8" />
        </div>
      </div>
    </div>
  )
}

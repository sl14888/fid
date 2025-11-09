import { FC } from 'react'

import { SmallCompanyCardProps } from './SmallCompanyCard.types'
import { TextLMedium, TextXS } from '@/components/ui/Typography'

import styles from './SmallCompanyCard.module.scss'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'

export const SmallCompanyCard: FC<SmallCompanyCardProps> = ({
  companyName,
  rating,
  logoUrl,
  onClick,
}) => {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.company__logoWrapper}>
        <img
          className={styles.company__logo}
          src={logoUrl}
          alt="company-name"
        />
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

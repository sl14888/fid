import { FC } from 'react'
import clsx from 'clsx'

import { CompanyListItemProps } from './CompanyListItem.types'

import { Heading5, TextLRegular, TextS } from '../ui/Typography'
import { Icon, IconName } from '../ui/Icon'

import { getInitials } from '@/lib/utils/string'
import { CompanyListItemSkeleton } from './CompanyListItemSkeleton'

import styles from './CompanyListItem.module.scss'

export const CompanyListItem: FC<CompanyListItemProps> = ({
  logoUrl,
  displayName,
  description,
  companyAverageGrade,
  companyCountFeedbacks,
  fluid,
  loading,
  onClick,
}) => {
  if (loading) {
    return <CompanyListItemSkeleton fluid={fluid} />
  }

  return (
    <article
      className={clsx(
        styles.companyList,
        fluid && styles['companyList--fluid']
      )}
      onClick={onClick}
    >
      <div className={styles.companyList__box}>
        <div className={styles.companyList__wrapper}>
          <div className={styles.companyList__companyLogo}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={displayName || 'Company logo'}
                className={styles.companyList__companyLogoImage}
              />
            ) : (
              <div className={styles.companyList__companyLogoPlaceholder}>
                {getInitials(displayName)}
              </div>
            )}
          </div>

          <div className={styles.companyList__boxName}>
            <Heading5>{displayName ?? 'Неизвестная компания'}</Heading5>
            <TextS className={styles.companyList__description}>
              {description ?? 'Описание неизвестной компании'}
            </TextS>
          </div>
        </div>

        <div className={styles.companyList__boxText}>
          <div className={styles.companyList__feedbacks}>
            <TextLRegular>{companyCountFeedbacks ?? 0}</TextLRegular>
            <Icon name={IconName.ReviewStar} />
          </div>
          <div className={styles.companyList__grade}>
            <TextLRegular>{companyAverageGrade ?? 0}</TextLRegular>
            <Icon name={IconName.Star} color="var(--rating-color-5)" />
          </div>
        </div>
      </div>
    </article>
  )
}

'use client'

import { FC } from 'react'
import clsx from 'clsx'

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import {
  Heading2,
  Heading4,
  TextMRegular,
  TextS,
  TextXS,
} from '@/components/ui/Typography'
import { getInitials } from '@/lib/utils/string'

import { CompanyCardProps } from './CompanyCard.types'

import styles from './CompanyCard.module.scss'
import { useMediaQuery } from '@/lib/hooks'
import { BREAKPOINTS } from '@/constants/breakpoints'

/**
 * Компонент карточки компании
 * Отображает информацию о компании с возможностью оставить отзыв и перейти на сайт
 */
export const CompanyCard: FC<CompanyCardProps> = ({
  name,
  employmentType,
  inn,
  averageGrade,
  description,
  logoUrl,
  website,
  onReviewClick,
  className,
  fluid = false,
  hideAllReviewsButton = false,
  onAllReviewsClick,
}) => {
  const isMobile = useMediaQuery(BREAKPOINTS.MD)

  const handleWebsiteClick = () => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer')
    }
  }

  const employmentTypeName = employmentType?.description || ''
  const displayInn = inn ? `ИНН ${inn}` : ''

  return (
    <article
      className={clsx(
        styles.companyCard,
        fluid && styles['companyCard--fluid'],
        className
      )}
    >
      <div className={styles.companyCard__header}>
        <div className={styles.companyCard__headerLeft}>
          {(employmentTypeName || displayInn) && (
            <div className={styles.companyCard__meta}>
              {employmentTypeName &&
                (isMobile ? (
                  <TextXS className={styles.companyCard__employmentType}>
                    {employmentTypeName}
                  </TextXS>
                ) : (
                  <TextS className={styles.companyCard__employmentType}>
                    {employmentTypeName}
                  </TextS>
                ))}
              {employmentTypeName && displayInn && (
                <span className={styles.companyCard__separator}>•</span>
              )}
              {displayInn &&
                (isMobile ? (
                  <TextXS className={styles.companyCard__inn}>
                    {displayInn}
                  </TextXS>
                ) : (
                  <TextS className={styles.companyCard__inn}>
                    {displayInn}
                  </TextS>
                ))}
            </div>
          )}

          <div className={styles.companyCard__titleRow}>
            {isMobile ? (
              <Heading4 className={styles.companyCard__name}>{name}</Heading4>
            ) : (
              <Heading2 className={styles.companyCard__name}>{name}</Heading2>
            )}
            <div className={styles.companyCard__rating}>
              <Icon
                name={IconName.Star}
                size={IconSize.Large}
                className={styles.companyCard__star}
                color="var(--rating-color-5)"
              />
              <TextMRegular className={styles.companyCard__ratingValue}>
                {averageGrade.toFixed(1)}
              </TextMRegular>
            </div>
          </div>
        </div>

        <div className={styles.companyCard__logo}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className={styles.companyCard__logoImage}
            />
          ) : (
            <div className={styles.companyCard__logoPlaceholder}>
              {getInitials(name)}
            </div>
          )}
        </div>
      </div>

      {description && (
        <TextMRegular className={styles.companyCard__description}>
          {description}
        </TextMRegular>
      )}

      <div className={styles.companyCard__actions}>
        <div className={styles.companyCard__actionsRow}>
          <Button
            text="Оставить отзыв"
            variant={ButtonVariant.PrimaryBlack}
            size={ButtonSize.Default}
            onClick={onReviewClick}
            className={styles.companyCard__primaryAction}
          />
          {website && (
            <Button
              text="Сайт"
              variant={ButtonVariant.SecondaryBlue}
              size={ButtonSize.Default}
              iconLeft={IconName.Earth}
              onClick={handleWebsiteClick}
              className={styles.companyCard__websiteButton}
            />
          )}
        </div>

        {!hideAllReviewsButton && (
          <Button
            text="Все отзывы"
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={onAllReviewsClick || onReviewClick}
            className={styles.companyCard__allReviewsButton}
          />
        )}
      </div>
    </article>
  )
}

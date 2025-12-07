import { FC } from 'react'
import clsx from 'clsx'

import styles from './CompanyCardSkeleton.module.scss'

interface CompanyCardSkeletonProps {
  fluid?: boolean
  className?: string
}

export const CompanyCardSkeleton: FC<CompanyCardSkeletonProps> = ({
  fluid = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        styles.skeleton,
        fluid && styles['skeleton--fluid'],
        className
      )}
    >
      {/* Header */}
      <div className={styles.skeleton__header}>
        <div className={styles.skeleton__headerLeft}>
          {/* Meta info */}
          <div className={styles.skeleton__meta}>
            <div className={styles.skeleton__metaItem} />
            <div className={styles.skeleton__metaItem} />
          </div>

          {/* Title and rating */}
          <div className={styles.skeleton__titleRow}>
            <div className={styles.skeleton__title} />
            <div className={styles.skeleton__rating} />
          </div>
        </div>

        {/* Logo */}
        <div className={styles.skeleton__logo} />
      </div>

      {/* Description */}
      {/* <div className={styles.skeleton__description}>
        <div className={styles.skeleton__descriptionLine} />
        <div className={styles.skeleton__descriptionLine} />
        <div
          className={clsx(
            styles.skeleton__descriptionLine,
            styles['skeleton__descriptionLine--short']
          )}
        />
      </div> */}

      {/* Actions */}
      <div className={styles.skeleton__actions}>
        <div className={styles.skeleton__actionsRow}>
          <div className={styles.skeleton__button} />
          <div className={styles.skeleton__button} />
        </div>
      </div>
    </div>
  )
}

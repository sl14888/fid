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
      <div className={styles.skeleton__header}>
        <div className={styles.skeleton__headerLeft}>
          <div className={styles.skeleton__meta}>
            <div className={styles.skeleton__metaItem} />
            <div className={styles.skeleton__metaItem} />
          </div>
          <div className={styles.skeleton__titleRow}>
            <div className={styles.skeleton__title} />
            <div className={styles.skeleton__rating} />
          </div>
        </div>
        <div className={styles.skeleton__logo} />
      </div>
      <div className={styles.skeleton__actions}>
        <div className={styles.skeleton__actionsRow}>
          <div className={styles.skeleton__button} />
          <div className={styles.skeleton__button} />
        </div>
      </div>
    </div>
  )
}

import { FC } from 'react'
import styles from '../SmallCompanyCard.module.scss'

interface SmallCompanyCardSkeletonProps {
  className?: string
}

export const SmallCompanyCardSkeleton: FC<SmallCompanyCardSkeletonProps> = ({
  className,
}) => {
  return (
    <div className={`${styles.card} ${styles['card--skeleton']} ${className || ''}`}>
      <div
        className={`${styles.company__logoWrapper} ${styles['skeleton']} ${styles['skeleton--logo']}`}
      />

      <div className={styles.company__text}>
        <div className={`${styles.skeleton} ${styles['skeleton--name']}`} />
        <div className={`${styles.skeleton} ${styles['skeleton--rating']}`} />
      </div>
    </div>
  )
}

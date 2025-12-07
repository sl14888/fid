import { FC } from 'react'
import clsx from 'clsx'
import styles from './ProfileFormSkeleton.module.scss'

export interface ProfileFormSkeletonProps {
  className?: string
}

export const ProfileFormSkeleton: FC<ProfileFormSkeletonProps> = ({
  className,
}) => {
  return (
    <div className={clsx(styles.profileFormSkeleton, className)}>
      <div className={styles.profileFormSkeleton__line} />
      <div className={styles.profileFormSkeleton__line} />
      <div className={styles.profileFormSkeleton__buttons}>
        <div className={styles.profileFormSkeleton__button} />
        <div className={styles.profileFormSkeleton__button} />
      </div>
    </div>
  )
}

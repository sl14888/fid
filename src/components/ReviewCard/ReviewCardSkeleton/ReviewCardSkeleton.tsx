import { FC } from 'react'
import clsx from 'clsx'

import styles from '../ReviewCard.module.scss'

interface ReviewCardSkeletonProps {
  fluid?: boolean
  className?: string
  fullReview?: boolean
  showPhotos?: boolean
}

export const ReviewCardSkeleton: FC<ReviewCardSkeletonProps> = ({
  fluid = false,
  className,
  fullReview = false,
  showPhotos = false,
}) => {
  return (
    <div
      className={clsx(
        styles.reviewCard,
        styles['reviewCard--skeleton'],
        fluid && styles['reviewCard--fluid'],
        className
      )}
    >
      <div className={styles.reviewCard__header}>
        <div className={styles.reviewCard__headerLeft}>
          <div
            className={clsx(
              styles.skeleton,
              styles['skeleton--circle'],
              styles['skeleton--avatar']
            )}
          />
          <div className={styles.reviewCard__info}>
            <div
              className={clsx(
                styles.skeleton,
                styles['skeleton--text'],
                styles['skeleton--name']
              )}
            />
            <div
              className={clsx(
                styles.skeleton,
                styles['skeleton--text'],
                styles['skeleton--date']
              )}
            />
          </div>
        </div>
        <div
          className={clsx(
            styles.skeleton,
            styles['skeleton--text'],
            styles['skeleton--rating']
          )}
        />
      </div>

      {showPhotos && fullReview && (
        <div className={styles.skeleton__photoGallery}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={clsx(styles.skeleton, styles['skeleton--photo'])}
            />
          ))}
        </div>
      )}

      <div className={styles.reviewCard__content}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.reviewCard__section}>
            <div
              className={clsx(
                styles.skeleton,
                styles['skeleton--circle'],
                styles['skeleton--icon']
              )}
            />
            <div className={styles['skeleton--multiline']}>
              <div
                className={clsx(styles.skeleton, styles['skeleton--text'])}
              />
              <div
                className={clsx(
                  styles.skeleton,
                  styles['skeleton--text'],
                  styles['skeleton--text--short']
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {showPhotos && !fullReview && (
        <div className={styles.skeleton__photoStack}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={clsx(
                styles.skeleton,
                styles['skeleton--circle'],
                styles['skeleton--photoStackItem']
              )}
            />
          ))}
        </div>
      )}

      <div className={styles.reviewCard__footer}>
        <div
          className={clsx(
            styles.skeleton,
            styles['skeleton--text'],
            styles['skeleton--link']
          )}
        />
      </div>
    </div>
  )
}

import { FC } from 'react'
import clsx from 'clsx'

import styles from '../UserListItem.module.scss'

interface UserListItemSkeletonProps {
  fluid?: boolean
  className?: string
}

/**
 * Skeleton-компонент для UserListItem
 * Отображается во время загрузки данных
 */
export const UserListItemSkeleton: FC<UserListItemSkeletonProps> = ({
  fluid,
  className,
}) => {
  return (
    <article
      className={clsx(
        styles.userListItem,
        styles['userListItem--skeleton'],
        fluid && styles['userListItem--fluid'],
        className
      )}
    >
      <div className={styles.userListItem__container}>
        <div className={styles.userListItem__main}>
          <div className={styles.userListItem__avatar}>
            <div
              className={clsx(styles.skeleton, styles['skeleton--avatar'])}
            />
          </div>
          <div className={styles.userListItem__info}>
            <div className={clsx(styles.skeleton, styles['skeleton--name'])} />
            <div className={clsx(styles.skeleton, styles['skeleton--phone'])} />
          </div>
        </div>

        <div className={styles.userListItem__aside}>
          <div className={clsx(styles.skeleton, styles['skeleton--email'])} />
          <div
            className={clsx(styles.skeleton, styles['skeleton--feedbacks'])}
          />
        </div>
      </div>
    </article>
  )
}

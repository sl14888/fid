'use client'

import { FC } from 'react'
import clsx from 'clsx'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import styles from './PhotoThumbnail.module.scss'

interface PhotoThumbnailProps {
  url: string
  onDelete?: () => void
  onClick?: () => void
  isDeleting?: boolean
  className?: string
}

export const PhotoThumbnail: FC<PhotoThumbnailProps> = ({
  url,
  onDelete,
  onClick,
  isDeleting,
  className,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  return (
    <div
      className={clsx(styles.thumbnail, className, {
        [styles['thumbnail--deleting']]: isDeleting,
      })}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img src={url} alt="Фото отзыва" className={styles.thumbnail__image} />

      {onDelete && (
        <button
          type="button"
          className={styles.thumbnail__deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Удалить фото"
        >
          <Icon name={IconName.Cross} size={IconSize.Small} color="#6E6E6E" />
        </button>
      )}

      {isDeleting && (
        <div className={styles.thumbnail__overlay}>
          <div className={styles.thumbnail__spinner} />
        </div>
      )}
    </div>
  )
}

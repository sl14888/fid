'use client'

import { FC } from 'react'
import clsx from 'clsx'

import type { PhotoStackProps } from './PhotoStack.types'

import styles from './PhotoStack.module.scss'

const DEFAULT_MAX_VISIBLE = 4

export const PhotoStack: FC<PhotoStackProps> = ({
  photos,
  maxVisible = DEFAULT_MAX_VISIBLE,
  className,
}) => {
  if (photos.length === 0) return null

  const visiblePhotos = photos.slice(0, maxVisible)
  const remaining = photos.length > maxVisible ? photos.length - (maxVisible - 1) : 0

  return (
    <div className={clsx(styles.photoStack, className)}>
      {visiblePhotos.map((photo, index) => {
        const isLast = index === maxVisible - 1
        const showCounter = isLast && remaining > 0

        return (
          <div
            key={photo.id}
            className={styles.photoStack__item}
            style={{ zIndex: index + 1 }}
          >
            {showCounter ? (
              <div className={styles.photoStack__overlay}>
                <img src={photo.url} alt="" />
                <div className={styles.photoStack__counter}>+{remaining}</div>
              </div>
            ) : (
              <img src={photo.url} alt="" />
            )}
          </div>
        )
      })}
    </div>
  )
}

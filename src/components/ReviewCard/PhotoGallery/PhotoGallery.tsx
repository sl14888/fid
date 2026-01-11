'use client'

import { FC, useRef, useState, useEffect } from 'react'
import clsx from 'clsx'

import { Icon, IconName } from '@/components/ui/Icon'

import type { PhotoGalleryProps } from './PhotoGallery.types'

import styles from './PhotoGallery.module.scss'

export const PhotoGallery: FC<PhotoGalleryProps> = ({
  photos,
  onPhotoClick,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showPrevButton, setShowPrevButton] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const checkScroll = () => {
      const isScrollable = container.scrollWidth > container.clientWidth
      const isAtStart = container.scrollLeft <= 5
      const isAtEnd =
        container.scrollLeft + container.clientWidth >= container.scrollWidth - 5

      setShowPrevButton(isScrollable && !isAtStart)
      setShowNextButton(isScrollable && !isAtEnd)
    }

    checkScroll()
    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [photos])

  const handleScrollNext = () => {
    if (!containerRef.current) return
    const scrollAmount = 200
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const handleScrollPrev = () => {
    if (!containerRef.current) return
    const scrollAmount = 200
    containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  if (photos.length === 0) return null

  return (
    <div className={clsx(styles.photoGallery, className)}>
      <button
        type="button"
        className={clsx(
          styles.photoGallery__navButton,
          styles['photoGallery__navButton--prev'],
          !showPrevButton && styles['photoGallery__navButton--hidden']
        )}
        onClick={handleScrollPrev}
        aria-label="Предыдущие фото"
      >
        <Icon name={IconName.ArrowLeft} />
      </button>

      {showPrevButton && (
        <div
          className={clsx(
            styles.photoGallery__gradient,
            styles['photoGallery__gradient--left']
          )}
        />
      )}

      <div ref={containerRef} className={styles.photoGallery__container}>
        {photos.map((photo, index) => (
          <div key={photo.id} className={styles.photoGallery__item}>
            <img
              src={photo.url}
              alt={`Фото ${index + 1}`}
              onClick={() => onPhotoClick?.(index)}
              className={styles.photoGallery__thumbnail}
            />
          </div>
        ))}
      </div>

      {showNextButton && <div className={styles.photoGallery__gradient} />}

      <button
        type="button"
        className={clsx(
          styles.photoGallery__navButton,
          styles['photoGallery__navButton--next'],
          !showNextButton && styles['photoGallery__navButton--hidden']
        )}
        onClick={handleScrollNext}
        aria-label="Следующие фото"
      >
        <Icon name={IconName.ArrowRight} />
      </button>
    </div>
  )
}

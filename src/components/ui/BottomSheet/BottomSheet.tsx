'use client'

import { FC, useEffect, useRef, useState, TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Icon, IconName } from '@/components/ui/Icon'
import { Heading4 } from '@/components/ui/Typography'
import { BottomSheetProps } from './BottomSheet.types'
import styles from './BottomSheet.module.scss'

const DEFAULT_OPACITY_VALUE = 0.5

export const BottomSheet: FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  snapPoints = [100],
  initialSnap = 0,
  disableSwipeToClose = false,
  disableCloseOnOverlay = false,
  children,
  className,
}) => {
  const [mounted, setMounted] = useState(false)
  const [snapIndex, setSnapIndex] = useState(initialSnap)
  const [touchStart, setTouchStart] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setSnapIndex(initialSnap)
      setTranslateY(0)
      setTouchStart(0)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialSnap])

  const isMovedEnoughForClose = (): boolean => {
    if (dialogRef.current) {
      const { clientHeight } = dialogRef.current
      return clientHeight / 3.3333 < translateY
    }
    return false
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (disableSwipeToClose) return
    setTouchStart(event.changedTouches[0].pageY)
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (disableSwipeToClose) return
    const currentTouch = event.changedTouches[0].pageY

    const diff = currentTouch - touchStart
    if (diff > 0) {
      setTranslateY(diff)
    }
  }

  const handleTouchEnd = () => {
    if (disableSwipeToClose) return

    if (isMovedEnoughForClose()) {
      onClose()
    } else if (translateY > 50 && snapIndex > 0) {
      setSnapIndex((prev) => prev - 1)
    } else if (translateY < -50 && snapIndex < snapPoints.length - 1) {
      setSnapIndex((prev) => prev + 1)
    }

    setTranslateY(0)
    setTouchStart(0)
  }

  const handleOverlayClick = () => {
    if (!disableCloseOnOverlay) {
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  const currentHeight = snapPoints[snapIndex]
  const translateYInPercents = dialogRef.current
    ? (translateY / dialogRef.current.clientHeight) * 100
    : 0

  const overlayOpacity =
    DEFAULT_OPACITY_VALUE -
    (DEFAULT_OPACITY_VALUE / 100) * translateYInPercents

  const sheet = (
    <div className={styles.root}>
      <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        style={{ opacity: overlayOpacity }}
      />

      <div
        ref={dialogRef}
        className={clsx(styles.sheet, className)}
        style={{
          maxHeight: `${currentHeight}vh`,
          transform: `translateY(${translateY}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handle}>
          <div className={styles.handleBar} />
        </div>

        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <Icon name={IconName.Cross} size="large" />
        </button>

        {title && <Heading4 className={styles.title}>{title}</Heading4>}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}

BottomSheet.displayName = 'BottomSheet'

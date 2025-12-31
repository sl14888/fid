'use client'

import { FC, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Icon, IconName } from '@/components/ui/Icon'
import { Heading4 } from '@/components/ui/Typography'
import { ModalProps, ModalSize } from './Modal.types'
import styles from './Modal.module.scss'

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = ModalSize.Medium,
  children,
  className,
}) => {
  const [mounted, setMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hasScroll, setHasScroll] = useState(false)
  const [scrolledToTop, setScrolledToTop] = useState(true)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true)
    })
  }, [])

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`
      )
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.removeProperty('--scrollbar-width')
      document.body.style.paddingRight = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.documentElement.style.removeProperty('--scrollbar-width')
      document.body.style.paddingRight = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    const checkScroll = () => {
      const content = contentRef.current
      if (!content) return

      const hasScrollableContent = content.scrollHeight > content.clientHeight
      setHasScroll(hasScrollableContent)

      if (hasScrollableContent) {
        setScrolledToTop(content.scrollTop === 0)
        setScrolledToBottom(
          Math.abs(
            content.scrollHeight - content.clientHeight - content.scrollTop
          ) < 1
        )
      } else {
        setScrolledToTop(true)
        setScrolledToBottom(true)
      }
    }

    const content = contentRef.current
    if (content && isOpen) {
      checkScroll()
      content.addEventListener('scroll', checkScroll)

      const resizeObserver = new ResizeObserver(checkScroll)
      resizeObserver.observe(content)

      return () => {
        content.removeEventListener('scroll', checkScroll)
        resizeObserver.disconnect()
      }
    }
  }, [isOpen, children])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  const modal = (
    <div className={styles.root}>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.wrapper} onClick={handleOverlayClick}>
        <div
          className={clsx(styles.modal, styles[`modal--${size}`], className)}
        >
          <div
            className={clsx(styles.header, {
              [styles['header--shadow']]: hasScroll && !scrolledToTop,
            })}
          >
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Закрыть"
            >
              <Icon name={IconName.Cross} size="large" />
            </button>

            {title && <Heading4 className={styles.title}>{title}</Heading4>}
          </div>

          <div
            ref={contentRef}
            className={clsx(styles.content, {
              [styles['content--fade-top']]: hasScroll && !scrolledToTop,
              [styles['content--fade-bottom']]: hasScroll && !scrolledToBottom,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

Modal.displayName = 'Modal'

'use client'

import { FC } from 'react'
import { sanitizeHtml } from '@/lib/utils/html-sanitizer'
import styles from './HTMLRenderer.module.scss'

interface HTMLRendererProps {
  content: string
  className?: string
}

export const HTMLRenderer: FC<HTMLRendererProps> = ({
  content,
  className = '',
}) => {
  const sanitizedContent = sanitizeHtml(content)

  return (
    <div
      className={`${styles.htmlRenderer} ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}

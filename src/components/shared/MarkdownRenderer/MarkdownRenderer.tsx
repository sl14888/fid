'use client'

import { FC, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import {
  Heading1,
  Heading2,
  Heading5,
  TextMRegular,
} from '@/components/ui/Typography'
import styles from './MarkdownRenderer.module.scss'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  const components: Components = useMemo(
    () => ({
      h1: ({ children }) => <Heading1>{children}</Heading1>,
      h2: ({ children }) => <Heading2>{children}</Heading2>,
      h3: ({ children }) => <Heading5>{children}</Heading5>,
      h4: ({ children }) => <Heading5>{children}</Heading5>,
      h5: ({ children }) => <Heading5>{children}</Heading5>,
      p: ({ children }) => <TextMRegular tag="p">{children}</TextMRegular>,
      ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
      ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
      li: ({ children }) => <li className={styles.listItem}>{children}</li>,
      a: ({ children, href }) => (
        <a
          href={href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => (
        <strong className={styles.strong}>{children}</strong>
      ),
      em: ({ children }) => <em className={styles.emphasis}>{children}</em>,
      hr: () => <hr className={styles.divider} />,
      blockquote: ({ children }) => (
        <blockquote className={styles.blockquote}>{children}</blockquote>
      ),
      code: ({ children, className }) => {
        const isInline = !className
        return isInline ? (
          <code className={styles.inlineCode}>{children}</code>
        ) : (
          <code className={styles.codeBlock}>{children}</code>
        )
      },
    }),
    []
  )

  return (
    <div className={`${styles.markdownRenderer} ${className}`}>
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

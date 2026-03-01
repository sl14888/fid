'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { TextMMedium, TextMRegular } from '@/components/ui/Typography'
import { Icon, IconName } from '@/components/ui/Icon'
import { AccordionProps } from './Accordion.types'

import styles from './Accordion.module.scss'

export const Accordion = ({ items, className, defaultOpenId }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={clsx(styles.accordion, className)}>
      {items.map((item) => {
        const isOpen = openId === item.id

        return (
          <div
            key={item.id}
            className={clsx(styles.item, { [styles['item--open']]: isOpen })}
          >
            <button
              className={styles.trigger}
              onClick={() => handleToggle(item.id)}
              aria-expanded={isOpen}
            >
              <TextMMedium tag="span">{item.title}</TextMMedium>
              <Icon
                name={IconName.ArrowDown}
                size="small"
                className={styles.icon}
              />
            </button>

            <div className={styles.content}>
              <div className={styles.contentInner}>
                {typeof item.content === 'string' ? (
                  <TextMRegular color="var(--color-text-secondary)">
                    {item.content}
                  </TextMRegular>
                ) : (
                  item.content
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

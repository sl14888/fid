import { ReactNode } from 'react'
import clsx from 'clsx'
import { TextMMedium } from '@/components/ui/Typography'

import styles from './StepCard.module.scss'

interface StepCardProps {
  step: number
  title: string
  variant?: 'default' | 'accent'
  children?: ReactNode
}

export const StepCard = ({
  step,
  title,
  variant = 'default',
  children,
}: StepCardProps) => {
  return (
    <div className={clsx(styles.card, styles[`card--${variant}`])}>
      <TextMMedium
        className={styles.title}
        color={variant === 'accent' ? 'var(--color-white)' : undefined}
      >
        {title}
      </TextMMedium>

      {children && <div className={styles.content}>{children}</div>}

      <div className={styles.step}>
        <span
          className={clsx(styles.stepNumber, {
            [styles['stepNumber--accent']]: variant === 'accent',
          })}
        >
          {step}
        </span>
      </div>
    </div>
  )
}

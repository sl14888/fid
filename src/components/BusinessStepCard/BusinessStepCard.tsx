'use client'

import clsx from 'clsx'
import { Heading5 } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { ButtonVariant, ButtonSize } from '@/components/ui/Button/Button.types'

import styles from './BusinessStepCard.module.scss'

interface BusinessStepCardProps {
  step: number | '+'
  title: string
  variant?: 'default' | 'accent'
  showConnectButton?: boolean
  onConnectClick?: () => void
}

export const BusinessStepCard = ({
  step,
  title,
  variant = 'default',
  showConnectButton = false,
  onConnectClick,
}: BusinessStepCardProps) => {
  const isAccent = variant === 'accent'

  return (
    <div className={clsx(styles.card, styles[`card--${variant}`])}>
      <Heading5
        color={isAccent ? 'var(--color-white)' : 'var(--color-gray-500)'}
        className={styles.title}
      >
        {title}
      </Heading5>

      {showConnectButton && (
        <Button
          text="Подключить"
          variant={ButtonVariant.PrimaryInverse}
          size={ButtonSize.Small}
          className={styles.button}
          onClick={onConnectClick}
        />
      )}

      <div className={clsx(styles.stepBadge, styles[`stepBadge--${variant}`])}>
        <span>{step}</span>
      </div>
    </div>
  )
}

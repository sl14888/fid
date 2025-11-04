'use client'

import { FC } from 'react'
import clsx from 'clsx'
import { BadgeProps, BadgeVariant, BadgeSize } from './Badge.types'
import { Icon } from '@/components/ui/Icon'
import { IconName, IconSize } from '@/components/ui/Icon/Icon.types'
import styles from './Badge.module.scss'

/**
 * Badge - Компонент бейджа/метки
 */
export const Badge: FC<BadgeProps> = ({
  text,
  variant = BadgeVariant.Info,
  size = BadgeSize.Large,
  iconLeft,
  iconRight,
  dot = false,
  pill = false,
  className,
  ...rest
}) => {
  const iconSizeMap = {
    [BadgeSize.Small]: IconSize.Large,
    [BadgeSize.Medium]: IconSize.Medium,
    [BadgeSize.Large]: IconSize.Small,
  }

  const currentIconSize = iconSizeMap[size]

  const renderIcon = (
    icon: (typeof IconName)[keyof typeof IconName] | React.ReactNode
  ) => {
    if (typeof icon === 'string') {
      return (
        <Icon
          name={icon as (typeof IconName)[keyof typeof IconName]}
          size={currentIconSize}
        />
      )
    }
    return icon
  }

  return (
    <span
      className={clsx(
        styles.badge,
        styles[`badge--${variant}`],
        styles[`badge--${size}`],
        {
          [styles['badge--dot']]: dot,
          [styles['badge--pill']]: pill,
        },
        className
      )}
      {...rest}
    >
      {!dot && iconLeft && (
        <span className={styles.badge__icon}>{renderIcon(iconLeft)}</span>
      )}
      {dot ? (
        <span className={styles.badge__dot} />
      ) : (
        <span className={styles.badge__text}>{text}</span>
      )}
      {!dot && iconRight && (
        <span className={styles.badge__icon}>{renderIcon(iconRight)}</span>
      )}
    </span>
  )
}

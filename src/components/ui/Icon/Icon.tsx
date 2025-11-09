'use client'

import { FC, Suspense } from 'react'
import clsx from 'clsx'
import type { IconProps } from './Icon.types'
import { loadIcon } from '@/lib/utils/icon'

import styles from './Icon.module.scss'

// Маппинг размера на пиксели
const sizeMap = {
  small: 16,
  medium: 20,
  large: 24,
}

export const Icon: FC<IconProps> = ({
  name,
  size = 'large',
  color = 'inherit',
  className,
  'aria-label': ariaLabel,
  style,
  ...props
}) => {
  const IconComponent = loadIcon(name, size)
  const pixelSize = sizeMap[size]

  // Объединяем style с цветом
  const iconStyle = {
    ...style,
    ...(color && { color }),
  }

  return (
    <Suspense
      fallback={
        <span
          className={clsx(styles.icon, styles[`icon--${size}`], className)}
          style={{ width: pixelSize, height: pixelSize, ...iconStyle }}
        />
      }
    >
      <IconComponent
        className={clsx(styles.icon, styles[`icon--${size}`], className)}
        width={pixelSize}
        height={pixelSize}
        style={iconStyle}
        aria-label={ariaLabel || name}
        role={ariaLabel ? 'img' : 'presentation'}
        {...props}
      />
    </Suspense>
  )
}

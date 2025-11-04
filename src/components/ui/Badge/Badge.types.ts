import { HTMLAttributes, ReactNode } from 'react'
import { IconName } from '@/components/ui/Icon/Icon.types'

/**
 * Варианты Badge компонента
 */
export const BadgeVariant = {
  Primary: 'primary',
  Success: 'success',
  Warning: 'warning',
  Danger: 'danger',
  Info: 'info',
  Neutral: 'neutral',
} as const

/**
 * Размеры Badge компонента
 */
export const BadgeSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const

/**
 * Свойства Badge компонента
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Текст бейджа
   */
  text: string

  /**
   * Вариант бейджа (цветовая схема)
   * @default BadgeVariant.Neutral
   */
  variant?: (typeof BadgeVariant)[keyof typeof BadgeVariant]

  /**
   * Размер бейджа
   * @default BadgeSize.Medium
   */
  size?: (typeof BadgeSize)[keyof typeof BadgeSize]

  /**
   * Иконка слева от текста
   */
  iconLeft?: (typeof IconName)[keyof typeof IconName] | ReactNode

  /**
   * Иконка справа от текста
   */
  iconRight?: (typeof IconName)[keyof typeof IconName] | ReactNode

  /**
   * Показать точку вместо текста (для индикаторов статуса)
   */
  dot?: boolean

  /**
   * Использовать округлую форму (pill)
   * @default false
   */
  pill?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

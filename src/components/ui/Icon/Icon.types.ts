import { SVGProps } from 'react'

// Объект со всеми именами иконок (используется как enum)
export const IconName = {
  ArrowDown: 'arrow-down',
  ArrowLeft: 'arrow-left',
  ArrowRight: 'arrow-right',
  ArrowUp: 'arrow-up',
  Cross: 'cross',
  CrossFill: 'cross-fill',
  Earth: 'earth',
  EyeClose: 'eye-close',
  EyeOpen: 'eye-open',
  House: 'house',
  List: 'list',
  Minus: 'minus',
  Person: 'person',
  PersonOutline: 'person-outline',
  Plus: 'plus',
  Review: 'review',
  ReviewStar: 'review-star',
  Search: 'search',
  Star: 'star',
  Swoosh: 'swoosh',
} as const

// Объект с размерами иконок (используется как enum)
export const IconSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * Имя иконки из доступных
   * Используйте IconName.Search, IconName.Star и т.д.
   */
  name: (typeof IconName)[keyof typeof IconName]

  /**
   * Размер иконки
   * - small: 16px
   * - medium: 20px
   * - large: 24px
   * @default 'medium'
   * Используйте IconSize.Small, IconSize.Medium, IconSize.Large
   */
  size?: (typeof IconSize)[keyof typeof IconSize]

  /**
   * Цвет иконки (любое валидное CSS значение)
   * @example '#FF0000'
   * @example 'red'
   * @example 'var(--color-primary)'
   */
  color?: string

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Доступная метка для скрин-ридеров
   */
  'aria-label'?: string
}

import { HTMLAttributes } from 'react'

// Объект с размерами рейтинга (используется как enum)
export const RatingSize = {
  Small: 'small',
  Large: 'large',
} as const

export interface RatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Текущее значение рейтинга (от 0 до maxValue)
   * @default 0
   */
  value?: number

  /**
   * Максимальное значение рейтинга (количество звезд)
   * @default 5
   */
  maxValue?: number

  /**
   * Размер звезд
   * - small: 16px
   * - large: 24px
   * @default 'large'
   * Используйте RatingSize.Small или RatingSize.Large
   */
  size?: (typeof RatingSize)[keyof typeof RatingSize]

  /**
   * Отключить взаимодействие с компонентом
   * @default false
   */
  disabled?: boolean

  /**
   * Режим только для чтения (показывает рейтинг без возможности изменения)
   * @default false
   */
  readonly?: boolean

  /**
   * Callback при изменении значения рейтинга
   * @param value новое значение рейтинга (1-5)
   */
  onChange?: (value: number) => void

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

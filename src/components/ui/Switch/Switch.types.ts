import { InputHTMLAttributes } from 'react'

/**
 * Размеры Switch компонента
 */
export const SwitchSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const

/**
 * Позиция лейбла относительно переключателя
 */
export const SwitchLabelPosition = {
  Left: 'left',
  Right: 'right',
} as const

/**
 * Свойства Switch компонента
 */
export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /**
   * Размер переключателя
   * @default SwitchSize.Medium
   */
  size?: (typeof SwitchSize)[keyof typeof SwitchSize]

  /**
   * Текст лейбла
   */
  label?: string

  /**
   * Позиция лейбла
   * @default SwitchLabelPosition.Right
   */
  labelPosition?: (typeof SwitchLabelPosition)[keyof typeof SwitchLabelPosition]

  /**
   * Состояние переключателя (включен/выключен)
   */
  checked?: boolean

  /**
   * Отключенное состояние
   */
  disabled?: boolean

  /**
   * Обработчик изменения состояния
   */
  onChange?: (checked: boolean) => void

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Описание для accessibility
   */
  'aria-label'?: string
}

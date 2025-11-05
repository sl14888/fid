import { InputHTMLAttributes, ReactNode } from 'react'

/**
 * Размеры инпута
 */
export const InputSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const

/**
 * Базовые пропсы для инпута
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Лейбл, который плавно поднимается при фокусе
   */
  label?: string

  /**
   * Текст подсказки внизу поля (вспомогательный текст)
   */
  helperText?: string

  /**
   * Текст ошибки (отображается красным цветом)
   */
  error?: string

  /**
   * Размер инпута
   * @default 'medium'
   */
  size?: (typeof InputSize)[keyof typeof InputSize]

  /**
   * Кастомный элемент справа (для специализированных инпутов типа PasswordInput)
   * @internal - не рекомендуется для прямого использования
   */
  rightElement?: ReactNode

  /**
   * Дополнительный CSS класс для контейнера
   */
  className?: string

  /**
   * CSS класс для самого input элемента
   */
  inputClassName?: string

  /**
   * Обязательное поле (добавляет * к лейблу)
   */
  required?: boolean

  /**
   * Растянуть на всю ширину контейнера
   * @default false
   */
  fluid?: boolean

  /**
   * Отключить анимацию floating label (label всегда наверху)
   * @default false
   */
  disableFloatingLabel?: boolean

  /**
   * Функция, вызываемая при изменении значения
   */
  onChangeValue?: (value: string) => void

  /**
   * Скрыть область для helper text/error (убирает отступ)
   * @default false
   */
  hideHelperTextArea?: boolean
}

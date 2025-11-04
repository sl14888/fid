import { TextareaHTMLAttributes } from 'react'

/**
 * Размеры TextArea
 */
export const TextAreaSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const

/**
 * Варианты resize
 */
export const TextAreaResize = {
  None: 'none',
  Vertical: 'vertical',
  Horizontal: 'horizontal',
  Both: 'both',
} as const

/**
 * Пропсы для TextArea
 */
export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
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
   * Размер TextArea
   * @default 'medium'
   */
  size?: (typeof TextAreaSize)[keyof typeof TextAreaSize]

  /**
   * Показывать счетчик символов
   * @default false
   */
  showCounter?: boolean

  /**
   * Максимальное количество символов
   */
  maxLength?: number

  /**
   * Минимальное количество строк
   * @default 3
   */
  rows?: number

  /**
   * Настройка изменения размера
   * @default 'vertical'
   */
  resize?: (typeof TextAreaResize)[keyof typeof TextAreaResize]

  /**
   * Дополнительный CSS класс для контейнера
   */
  className?: string

  /**
   * CSS класс для самого textarea элемента
   */
  textareaClassName?: string

  /**
   * Обязательное поле (добавляет * к лейблу)
   */
  required?: boolean

  /**
   * Функция, вызываемая при изменении значения
   */
  onChangeValue?: (value: string) => void
}

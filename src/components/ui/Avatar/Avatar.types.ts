import { HTMLAttributes } from 'react'

/**
 * Размеры Avatar компонента
 */
export const AvatarSize = {
  XS: 'xs',
  MD: 'md',
  XL: 'xl',
} as const

/**
 * Цветовые варианты для фона инициалов
 */
export const AvatarColor = {
  Primary: 'primary',
  Success: 'success',
  Warning: 'warning',
  Gray: 'gray',
} as const

/**
 * Свойства Avatar компонента
 */
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * URL изображения аватара
   */
  src?: string

  /**
   * Альтернативный текст для изображения
   * @default 'Avatar'
   */
  alt?: string

  /**
   * Инициалы для отображения когда нет изображения
   * Будут автоматически обрезаны до 2 символов
   */
  initials?: string

  /**
   * Размер аватара
   * xs - 40px, md - 56px, xl - 120px
   * @default AvatarSize.MD
   */
  size?: (typeof AvatarSize)[keyof typeof AvatarSize]

  /**
   * Цвет фона для инициалов
   * @default AvatarColor.Gray
   */
  color?: (typeof AvatarColor)[keyof typeof AvatarColor]

  /**
   * Обработчик клика (делает аватар кликабельным)
   */
  onClick?: () => void

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

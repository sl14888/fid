import { HTMLAttributes } from 'react'

/**
 * Пропсы для компонента Header
 */
export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Показывать ли поле поиска
   * @default true
   */
  showSearch?: boolean
}

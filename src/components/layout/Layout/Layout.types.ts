import { HTMLAttributes, ReactNode } from 'react'

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Содержимое страницы
   */
  children: ReactNode

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Отключить автоматический Container для контента
   * Полезно для full-width страниц
   * @default false
   */
  disableContainer?: boolean

  /**
   * Показать Header
   * @default true
   */
  showHeader?: boolean

  /**
   * Показать Footer
   * @default false
   */
  showFooter?: boolean

  /**
   * Показать TopBar (мобильная навигация)
   * @default true
   */
  showTopBar?: boolean
}

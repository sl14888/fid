import { ElementType, HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /**
   * Содержимое контейнера
   */
  children: ReactNode

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Отключить горизонтальные отступы
   * @default false
   */
  noPadding?: boolean

  /**
   * HTML тег для рендера
   * @default 'div'
   */
  as?: ElementType
}

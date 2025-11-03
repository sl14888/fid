import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { IconName } from '@/components/ui/Icon/Icon.types'

/**
 * Варианты стилей кнопки
 */
export const ButtonVariant = {
  Primary: 'primary',
  PrimaryBlack: 'primaryBlack',
  PrimaryInverse: 'primaryInverse',
  SecondaryBlue: 'secondaryBlue',
  SecondaryGray: 'secondaryGray',
} as const

/**
 * Размеры кнопки
 */
export const ButtonSize = {
  Default: 'default',
  Small: 'small',
} as const

/**
 * Базовые пропсы для всех вариантов кнопки
 */
interface BaseButtonProps {
  /**
   * Текст кнопки
   */
  text: string

  /**
   * Вариант стиля кнопки
   * @default ButtonVariant.Primary
   */
  variant?: (typeof ButtonVariant)[keyof typeof ButtonVariant]

  /**
   * Размер кнопки
   * @default ButtonSize.Default
   */
  size?: (typeof ButtonSize)[keyof typeof ButtonSize]

  /**
   * Иконка слева от текста
   * Может быть именем иконки (IconName.Search) или готовым компонентом Icon
   * @example iconLeft={IconName.Search}
   * @example iconLeft={<Icon name={IconName.Search} color="red" />}
   */
  iconLeft?: (typeof IconName)[keyof typeof IconName] | ReactNode

  /**
   * Иконка справа от текста
   * Может быть именем иконки (IconName.ArrowRight) или готовым компонентом Icon
   * @example iconRight={IconName.ArrowRight}
   * @example iconRight={<Icon name={IconName.Cross} size="large" />}
   */
  iconRight?: (typeof IconName)[keyof typeof IconName] | ReactNode

  /**
   * Состояние загрузки - показывает спиннер вместо контента
   * Автоматически делает кнопку disabled
   */
  loading?: boolean

  /**
   * Отключенное состояние кнопки
   */
  disabled?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Растянуть кнопку на всю ширину
   * @default false
   */
  fluid?: boolean

  /**
   * Дочерние элементы (альтернатива text)
   */
  children?: ReactNode
}

/**
 * Пропсы для кнопки-ссылки (с навигацией)
 */
export interface ButtonLinkProps
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  /**
   * URL для навигации (использует Next.js Link)
   */
  href: string

  /**
   * Где открывать ссылку
   * @example '_blank' - в новой вкладке
   */
  target?: string

  /**
   * onClick недоступен для кнопки-ссылки
   */
  onClick?: never
}

/**
 * Пропсы для обычной кнопки (без навигации)
 */
export interface ButtonClickProps
  extends BaseButtonProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      keyof BaseButtonProps | 'children'
    > {
  /**
   * Обработчик клика
   */
  onClick?: () => void

  /**
   * href недоступен для обычной кнопки
   */
  href?: never

  /**
   * target недоступен для обычной кнопки
   */
  target?: never
}

/**
 * Union type для всех вариантов кнопки
 * Кнопка может быть либо ссылкой (с href), либо обычной кнопкой (с onClick)
 */
export type ButtonProps = ButtonLinkProps | ButtonClickProps

'use client'

import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { Icon } from '../Icon'
import { IconName } from '../Icon/Icon.types'
import { Spinner } from '../Spinner'
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types'

import styles from './Button.module.scss'

/**
 * Универсальный компонент кнопки
 */
export const Button: FC<ButtonProps> = ({
  text,
  variant = ButtonVariant.Primary,
  size = ButtonSize.Default,
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fluid = false,
  className = '',
  children,
  ...rest
}) => {
  const isLink = 'href' in rest && rest.href

  const buttonClasses = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    {
      [styles['button--loading']]: loading,
      [styles['button--disabled']]: disabled || loading,
      [styles['button--fluid']]: fluid,
    },
    className
  )

  const iconSize = size === ButtonSize.Small ? 'small' : 'medium'

  const isIconName = (
    icon: (typeof IconName)[keyof typeof IconName] | ReactNode
  ): icon is (typeof IconName)[keyof typeof IconName] => {
    return typeof icon === 'string'
  }

  const renderIcon = (
    icon: (typeof IconName)[keyof typeof IconName] | ReactNode | undefined
  ) => {
    if (!icon) return null

    if (isIconName(icon)) {
      return <Icon name={icon} size={iconSize} />
    }

    return <span className={styles.button__span}>{icon}</span>
  }

  const buttonContent = (
    <>
      {loading ? (
        <Spinner size={size === ButtonSize.Small ? 'small' : 'default'} />
      ) : (
        <>
          {renderIcon(iconLeft)}
          <span className={styles.button__text}>{children || text}</span>
          {renderIcon(iconRight)}
        </>
      )}
    </>
  )

  if (isLink) {
    const linkProps = rest as Extract<typeof rest, { href: string }>
    const { href, target, ...linkRest } = linkProps
    return (
      <Link
        href={href}
        target={target}
        className={buttonClasses}
        aria-disabled={disabled || loading}
        {...linkRest}
      >
        {buttonContent}
      </Link>
    )
  }

  const buttonProps = rest as Exclude<typeof rest, { href: string }>
  const { onClick, type = 'button', ...buttonRest } = buttonProps
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-busy={loading}
      {...buttonRest}
    >
      {buttonContent}
    </button>
  )
}

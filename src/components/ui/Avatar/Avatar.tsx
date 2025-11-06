'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'
import { AvatarProps, AvatarSize, AvatarColor } from './Avatar.types'
import { Icon } from '@/components/ui/Icon'
import { IconName, IconSize } from '@/components/ui/Icon/Icon.types'

import styles from './Avatar.module.scss'

/**
 * Avatar - Компонент аватара пользователя
 */
export const Avatar: FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = AvatarSize.MD,
  color = AvatarColor.Gray,
  onClick,
  className,
  ...rest
}) => {
  const [imageError, setImageError] = useState(false)

  const displayInitials = initials ? initials.slice(0, 2).toUpperCase() : null

  const getIconSize = () => {
    switch (size) {
      case AvatarSize.XS:
        return IconSize.Small
      case AvatarSize.MD:
        return IconSize.Medium
      case AvatarSize.XL:
        return IconSize.Large
      default:
        return IconSize.Medium
    }
  }

  const avatarClasses = clsx(
    styles.avatar,
    styles[`avatar--${size}`],
    styles[`avatar--${color}`],
    {
      [styles['avatar--clickable']]: Boolean(onClick),
    },
    className
  )

  const handleImageError = () => {
    setImageError(true)
  }

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          className={styles.avatar__image}
          onError={handleImageError}
        />
      )
    }

    if (displayInitials) {
      return <span className={styles.avatar__initials}>{displayInitials}</span>
    }

    return (
      <Icon
        name={IconName.Person}
        size={getIconSize()}
        className={styles.avatar__icon}
      />
    )
  }

  return (
    <div className={avatarClasses} onClick={onClick} {...rest}>
      {renderContent()}
    </div>
  )
}

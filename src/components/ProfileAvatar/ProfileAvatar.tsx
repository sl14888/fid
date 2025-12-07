'use client'

import { FC } from 'react'
import clsx from 'clsx'
import { Avatar, AvatarSize } from '@/components/ui/Avatar'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import styles from './ProfileAvatar.module.scss'

export interface ProfileAvatarProps {
  /**
   * URL аватара (пока заглушка)
   */
  avatarUrl?: string

  /**
   * Инициалы пользователя для отображения
   */
  initials?: string

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

/**
 * Компонент аватара пользователя с кнопкой изменения
 * Пока реализован как заглушка
 */
export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  avatarUrl,
  initials,
  className,
}) => {
  const handleChangeAvatar = () => {
    console.log('Изменение аватара - функционал в разработке')
  }

  return (
    <div className={clsx(styles.profileAvatar, className)}>
      <Avatar src={avatarUrl} initials={initials} size={AvatarSize.XL} />

      <Button
        variant={ButtonVariant.SecondaryBlue}
        size={ButtonSize.Small}
        onClick={handleChangeAvatar}
        className={styles.profileAvatar__button}
      >
        Изменить аватар
      </Button>
    </div>
  )
}

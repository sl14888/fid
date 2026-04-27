'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'
import { Avatar, AvatarSize } from '@/components/ui/Avatar'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { AvatarUploadModal } from '@/components/modals/AvatarUploadModal'
import { useUsersStore } from '@/store/users.store'
import styles from './ProfileAvatar.module.scss'

export interface ProfileAvatarProps {
  /**
   * URL аватара
   */
  avatarUrl?: string

  /**
   * Инициалы пользователя для отображения
   */
  initials?: string

  /**
   * Переопределить загрузку аватара (для admin-режима)
   */
  onUpload?: (file: File) => Promise<boolean>

  /**
   * Переопределить состояние загрузки (для admin-режима)
   */
  isUploading?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

/**
 * Компонент аватара пользователя с кнопкой изменения
 */
export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  avatarUrl,
  initials,
  onUpload,
  isUploading: isUploadingProp,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isUploadingAvatar } = useUsersStore()
  const isUploading = isUploadingProp ?? isUploadingAvatar

  const handleChangeAvatar = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className={clsx(styles.profileAvatar, className)}>
        <div className={styles.profileAvatar__avatarWrapper}>
          <Avatar src={avatarUrl} initials={initials} size={AvatarSize.XL} />
          {isUploading && (
            <div className={styles.profileAvatar__loadingOverlay}>
              <div className={styles.profileAvatar__spinner} />
            </div>
          )}
        </div>

        <Button
          variant={ButtonVariant.SecondaryBlue}
          size={ButtonSize.Small}
          onClick={handleChangeAvatar}
          className={styles.profileAvatar__button}
          disabled={isUploading}
        >
          {isUploading ? 'Загрузка...' : 'Изменить аватар'}
        </Button>
      </div>

      <AvatarUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentAvatarUrl={avatarUrl}
        onUpload={onUpload}
        isUploading={isUploadingProp}
      />
    </>
  )
}

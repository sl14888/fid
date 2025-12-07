'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'
import { Input, InputSize } from '@/components/ui/Input'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import type { ProfileFormProps } from './ProfileForm.types'
import styles from './ProfileForm.module.scss'

/**
 * Компонент формы профиля пользователя
 * Поддерживает редактирование email и выход из системы
 */
export const ProfileForm: FC<ProfileFormProps> = ({
  name,
  email,
  onLogout,
  onSaveEmail,
  isSaving = false,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [emailValue, setEmailValue] = useState(email)

  const handleEditToggle = async () => {
    if (isEditing) {
      // Режим сохранения
      const success = await onSaveEmail(emailValue)
      if (success) {
        setIsEditing(false)
      }
    } else {
      // Режим редактирования
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setEmailValue(email)
    setIsEditing(false)
  }

  return (
    <div className={clsx(styles.profileForm, className)}>
      <div className={styles.profileForm__inputs}>
        <Input
          label="Имя"
          value={name ?? 'Не указано'}
          disabled
          size={InputSize.Large}
          fluid
          disableFloatingLabel
        />

        <Input
          label="Электронная почта"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          disabled={!isEditing}
          size={InputSize.Large}
          fluid
          disableFloatingLabel
          type="email"
        />
      </div>

      <div className={styles.profileForm__actions}>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Default}
          onClick={handleEditToggle}
          loading={isSaving}
          disabled={isSaving}
        >
          {isEditing ? 'Сохранить' : 'Изменить данные'}
        </Button>

        {isEditing && (
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Отмена
          </Button>
        )}

        <Button
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Default}
          onClick={onLogout}
          disabled={isSaving}
        >
          Выйти
        </Button>
      </div>
    </div>
  )
}

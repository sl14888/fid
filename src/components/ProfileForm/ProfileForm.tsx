'use client'

import { FC, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { Input, InputSize } from '@/components/ui/Input'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { EmailSentModal } from '@/components/modals/EmailSentModal'
import { useUsersStore } from '@/store/users.store'
import type { ProfileFormProps } from './ProfileForm.types'
import styles from './ProfileForm.module.scss'
import { useMediaQuery } from '@/lib/hooks'
import { BREAKPOINTS } from '@/constants/breakpoints'

/**
 * Компонент формы профиля пользователя
 * Поддерживает редактирование email и выход из системы
 */
export const ProfileForm: FC<ProfileFormProps> = ({
  name,
  email,
  isEmailVerified,
  onLogout,
  onSaveEmail,
  isSaving = false,
  className,
}) => {
  const { sendVerificationEmail, isSendingVerification } = useUsersStore()

  const [isEditing, setIsEditing] = useState(false)
  const [emailValue, setEmailValue] = useState(email)
  const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false)
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false)

  const isMobile = useMediaQuery(BREAKPOINTS.MD - 1)

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

  const handleResendVerification = async () => {
    const success = await sendVerificationEmail(email)
    if (success) {
      setIsVerificationEmailSent(true)
      setIsEmailSentModalOpen(true)
    } else {
      toast.error('Не удалось отправить письмо')
    }
  }

  const emailHelperText = isEmailVerified ? 'Подтверждена' : undefined

  const emailError = !isEmailVerified
    ? 'Не подтверждена. Письмо для подтверждения отправлено.'
    : undefined

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
          helperText={emailHelperText}
          error={emailError}
          fluid
          disableFloatingLabel
          type="email"
        />

        {!isEmailVerified && !isVerificationEmailSent && (
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            onClick={handleResendVerification}
            loading={isSendingVerification}
            disabled={isSendingVerification}
            className={styles.profileForm__resendButton}
          >
            Отправить повторно
          </Button>
        )}
      </div>

      <div className={styles.profileForm__actions}>
        <Button
          variant={ButtonVariant.SecondaryBlue}
          size={ButtonSize.Default}
          onClick={handleEditToggle}
          loading={isSaving}
          disabled={isSaving}
          fluid={isMobile}
        >
          {isEditing ? 'Сохранить' : 'Изменить данные'}
        </Button>

        {isEditing && (
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={handleCancel}
            disabled={isSaving}
            fluid={isMobile}
          >
            Отмена
          </Button>
        )}

        <Button
          variant={ButtonVariant.SecondaryGray}
          size={ButtonSize.Default}
          onClick={onLogout}
          disabled={isSaving}
          fluid={isMobile}
        >
          Выйти
        </Button>
      </div>

      <EmailSentModal
        isOpen={isEmailSentModalOpen}
        onClose={() => setIsEmailSentModalOpen(false)}
      />
    </div>
  )
}

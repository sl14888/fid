'use client'

import { FC } from 'react'

import { Button, ButtonVariant } from '@/components/ui/Button'
import { TextLRegular } from '@/components/ui/Typography'

import { type SuccessStepProps } from '../ForgotPasswordModal.types'
import styles from '../ForgotPasswordModal.module.scss'

export const SuccessStep: FC<SuccessStepProps> = ({ onLoginClick, onClose }) => {
  const handleContinue = () => {
    onLoginClick?.()
    onClose()
  }

  return (
    <div className={styles.stepContent}>
      <div className={styles.successMessage}>
        <TextLRegular>Вы можете войти в профиль</TextLRegular>
      </div>

      <div className={styles.actions}>
        <Button
          text="Продолжить"
          variant={ButtonVariant.Primary}
          onClick={handleContinue}
          fluid
        />
      </div>
    </div>
  )
}

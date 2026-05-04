'use client'

import { FC, useState, useEffect } from 'react'

import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { ModalSize } from '@/components/ui/Modal/Modal.types'

import { EmailStep, CodeStep, NewPasswordStep, SuccessStep } from './steps'
import {
  ForgotPasswordModalProps,
  ForgotPasswordStep,
} from './ForgotPasswordModal.types'

import styles from './ForgotPasswordModal.module.scss'

const STEP_TITLES: Record<ForgotPasswordStep, string> = {
  [ForgotPasswordStep.EMAIL]: 'Восстановление пароля',
  [ForgotPasswordStep.CODE]: 'Введите код',
  [ForgotPasswordStep.NEW_PASSWORD]: 'Новый пароль',
  [ForgotPasswordStep.SUCCESS]: 'Пароль изменён',
}

export const ForgotPasswordModal: FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
}) => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EMAIL
  )
  const [email, setEmail] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(ForgotPasswordStep.EMAIL)
      setEmail('')
      setVerificationCode('')
    }
  }, [isOpen])

  const renderStep = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return (
          <EmailStep
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setEmail={setEmail}
            setCurrentStep={setCurrentStep}
          />
        )
      case ForgotPasswordStep.CODE:
        return (
          <CodeStep
            email={email}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setVerificationCode={setVerificationCode}
            setCurrentStep={setCurrentStep}
          />
        )
      case ForgotPasswordStep.NEW_PASSWORD:
        return (
          <NewPasswordStep
            email={email}
            verificationCode={verificationCode}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setCurrentStep={setCurrentStep}
          />
        )
      case ForgotPasswordStep.SUCCESS:
        return <SuccessStep onLoginClick={onLoginClick} onClose={onClose} />
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={STEP_TITLES[currentStep]}
      size={ModalSize.Small}
    >
      <div className={styles.forgotPasswordModal}>{renderStep()}</div>
    </ResponsiveModal>
  )
}

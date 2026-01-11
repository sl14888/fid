'use client'

import { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { FormField } from '@/components/forms/FormField'
import { TextLRegular, TextS } from '@/components/ui/Typography'
import { ModalSize } from '@/components/ui/Modal/Modal.types'

import { passwordResetApi } from '@/lib/api'
import {
  forgotPasswordEmailSchema,
  forgotPasswordCodeSchema,
  forgotPasswordNewPasswordSchema,
  type ForgotPasswordEmailFormData,
  type ForgotPasswordCodeFormData,
  type ForgotPasswordNewPasswordFormData,
} from '@/lib/validations/forgotPassword.schema'
import {
  FORGOT_PASSWORD_EMAIL_DEFAULT_VALUES,
  FORGOT_PASSWORD_CODE_DEFAULT_VALUES,
  FORGOT_PASSWORD_NEW_PASSWORD_DEFAULT_VALUES,
} from '@/constants/forms'

import {
  ForgotPasswordModalProps,
  ForgotPasswordStep,
} from './ForgotPasswordModal.types'
import styles from './ForgotPasswordModal.module.scss'

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

  const getStepTitle = (step: ForgotPasswordStep): string => {
    switch (step) {
      case ForgotPasswordStep.EMAIL:
        return 'Восстановление пароля'
      case ForgotPasswordStep.CODE:
        return 'Введите код'
      case ForgotPasswordStep.NEW_PASSWORD:
        return 'Новый пароль'
      case ForgotPasswordStep.SUCCESS:
        return 'Пароль изменён'
      default:
        return ''
    }
  }

  const EmailStep: FC = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ForgotPasswordEmailFormData>({
      resolver: zodResolver(forgotPasswordEmailSchema),
      defaultValues: FORGOT_PASSWORD_EMAIL_DEFAULT_VALUES,
    })

    const onSubmit = async (data: ForgotPasswordEmailFormData) => {
      setIsLoading(true)
      try {
        await passwordResetApi.sendPasswordResetCode(data.email)
        setEmail(data.email)
        setCurrentStep(ForgotPasswordStep.CODE)
        toast.success('Код отправлен на почту')
      } catch (error) {
        toast.error('Не удалось отправить код. Попробуйте снова')
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.stepContent}>
        <div className={styles.description}>
          <TextS>Отправим код для сброса пароля на почту</TextS>
        </div>

        <div className={styles.fields}>
          <FormField name="email" control={control}>
            <Input
              label="Электронная&nbsp;почта"
              type="email"
              error={errors.email?.message}
              fluid
              autoComplete="email"
            />
          </FormField>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            text="Продолжить"
            variant={ButtonVariant.Primary}
            loading={isLoading}
            fluid
          />
        </div>
      </form>
    )
  }

  const CodeStep: FC = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ForgotPasswordCodeFormData>({
      resolver: zodResolver(forgotPasswordCodeSchema),
      defaultValues: FORGOT_PASSWORD_CODE_DEFAULT_VALUES,
    })

    const onSubmit = async (data: ForgotPasswordCodeFormData) => {
      setVerificationCode(data.code)
      setCurrentStep(ForgotPasswordStep.NEW_PASSWORD)
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.stepContent}>
        <div className={styles.description}>
          <TextS>Проверьте почту. В том числе папку «Спам»</TextS>
        </div>

        <div className={styles.fields}>
          <FormField name="code" control={control}>
            <Input
              label="Код из письма"
              type="text"
              error={errors.code?.message}
              fluid
              autoComplete="off"
            />
          </FormField>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            text="Продолжить"
            variant={ButtonVariant.Primary}
            loading={isLoading}
            fluid
          />
        </div>
      </form>
    )
  }

  const NewPasswordStep: FC = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ForgotPasswordNewPasswordFormData>({
      resolver: zodResolver(forgotPasswordNewPasswordSchema),
      defaultValues: FORGOT_PASSWORD_NEW_PASSWORD_DEFAULT_VALUES,
    })

    const onSubmit = async (data: ForgotPasswordNewPasswordFormData) => {
      setIsLoading(true)
      try {
        await passwordResetApi.resetPassword({
          email,
          verificationCode: Number(verificationCode),
          newPassword: data.newPassword,
        })
        setCurrentStep(ForgotPasswordStep.SUCCESS)
        toast.success('Пароль успешно изменён')
      } catch (error) {
        toast.error(
          'Не удалось изменить пароль. Проверьте код и попробуйте снова'
        )
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.stepContent}>
        <div className={styles.description}>
          <TextS>Введите новый пароль для вашего аккаунта</TextS>
        </div>

        <div className={styles.fields}>
          <FormField name="newPassword" control={control}>
            <PasswordInput
              label="Новый пароль"
              error={errors.newPassword?.message}
              fluid
              autoComplete="new-password"
            />
          </FormField>

          <FormField name="confirmPassword" control={control}>
            <PasswordInput
              label="Подтвердите пароль"
              error={errors.confirmPassword?.message}
              fluid
              autoComplete="new-password"
            />
          </FormField>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            text="Продолжить"
            variant={ButtonVariant.Primary}
            loading={isLoading}
            fluid
          />
        </div>
      </form>
    )
  }

  const SuccessStep: FC = () => {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return <EmailStep />
      case ForgotPasswordStep.CODE:
        return <CodeStep />
      case ForgotPasswordStep.NEW_PASSWORD:
        return <NewPasswordStep />
      case ForgotPasswordStep.SUCCESS:
        return <SuccessStep />
      default:
        return null
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={getStepTitle(currentStep)}
      size={ModalSize.Small}
    >
      <div className={styles.forgotPasswordModal}>{renderStepContent()}</div>
    </ResponsiveModal>
  )
}

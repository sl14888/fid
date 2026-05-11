'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Button, ButtonVariant } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { FormField } from '@/components/forms/FormField'
import { TextS } from '@/components/ui/Typography'

import { passwordResetApi } from '@/lib/api'
import { getBackendErrorMessage } from '@/lib/utils/toast-utils'
import {
  forgotPasswordNewPasswordSchema,
  type ForgotPasswordNewPasswordFormData,
} from '@/lib/validations/forgotPassword.schema'
import { FORGOT_PASSWORD_NEW_PASSWORD_DEFAULT_VALUES } from '@/constants/forms'

import { ForgotPasswordStep, type NewPasswordStepProps } from '../ForgotPasswordModal.types'
import styles from '../ForgotPasswordModal.module.scss'

export const NewPasswordStep: FC<NewPasswordStepProps> = ({
  email,
  verificationCode,
  isLoading,
  setIsLoading,
  setCurrentStep,
}) => {
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
      toast.error(getBackendErrorMessage(error, 'Не удалось изменить пароль. Попробуйте снова'))
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
            helperText="От 8 символов: A-z, 0-9. Кроме: #,$,%"
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

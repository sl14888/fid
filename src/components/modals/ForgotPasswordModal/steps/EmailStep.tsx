'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Button, ButtonVariant } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { TextS } from '@/components/ui/Typography'

import { passwordResetApi } from '@/lib/api'
import { getBackendErrorMessage } from '@/lib/utils/toast-utils'
import {
  forgotPasswordEmailSchema,
  type ForgotPasswordEmailFormData,
} from '@/lib/validations/forgotPassword.schema'
import { FORGOT_PASSWORD_EMAIL_DEFAULT_VALUES } from '@/constants/forms'

import { ForgotPasswordStep, type EmailStepProps } from '../ForgotPasswordModal.types'
import styles from '../ForgotPasswordModal.module.scss'

export const EmailStep: FC<EmailStepProps> = ({
  isLoading,
  setIsLoading,
  setEmail,
  setCurrentStep,
}) => {
  const {
    control,
    handleSubmit,
    setError,
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
      setError('email', {
        message: getBackendErrorMessage(error, 'Пользователь с таким email не найден'),
      })
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

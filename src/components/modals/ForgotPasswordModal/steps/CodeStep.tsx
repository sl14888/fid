'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, ButtonVariant } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormField } from '@/components/forms/FormField'
import { TextS } from '@/components/ui/Typography'

import { passwordResetApi } from '@/lib/api'
import { getBackendErrorMessage } from '@/lib/utils/toast-utils'
import {
  forgotPasswordCodeSchema,
  type ForgotPasswordCodeFormData,
} from '@/lib/validations/forgotPassword.schema'
import { FORGOT_PASSWORD_CODE_DEFAULT_VALUES } from '@/constants/forms'

import { ForgotPasswordStep, type CodeStepProps } from '../ForgotPasswordModal.types'
import styles from '../ForgotPasswordModal.module.scss'

export const CodeStep: FC<CodeStepProps> = ({
  email,
  isLoading,
  setIsLoading,
  setVerificationCode,
  setCurrentStep,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordCodeFormData>({
    resolver: zodResolver(forgotPasswordCodeSchema),
    defaultValues: FORGOT_PASSWORD_CODE_DEFAULT_VALUES,
  })

  const onSubmit = async (data: ForgotPasswordCodeFormData) => {
    setIsLoading(true)
    try {
      await passwordResetApi.verifyResetCode({
        email,
        verificationCode: Number(data.code),
      })
      setVerificationCode(data.code)
      setCurrentStep(ForgotPasswordStep.NEW_PASSWORD)
    } catch (error) {
      setError('code', {
        message: getBackendErrorMessage(error, 'Неверный код. Попробуйте снова'),
      })
    } finally {
      setIsLoading(false)
    }
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

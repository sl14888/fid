'use client'

import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'

import { Button, ButtonVariant } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { FormField } from '@/components/forms/FormField'
import { Heading3 } from '@/components/ui/Typography'

import { useAuthStore } from '@/store/auth.store'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.schema'
import { LOGIN_FORM_DEFAULT_VALUES } from '@/constants/forms'

import { LoginFormProps } from './LoginForm.types'
import styles from './LoginForm.module.scss'

export const LoginForm: FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
  className,
}) => {
  const { login, isLoading } = useAuthStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
  })

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data)

    if (success) {
      onSuccess?.()
    }
  }

  const handleForgotPasswordClick = () => {
    onForgotPasswordClick?.()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(styles.loginForm, className)}
    >
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

        <FormField name="password" control={control}>
          <PasswordInput
            label="Пароль"
            error={errors.password?.message}
            fluid
            autoComplete="current-password"
          />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          text="Войти"
          variant={ButtonVariant.Primary}
          loading={isLoading}
          fluid
        />

        <div className={styles.links}>
          <Button
            text="Регистрация"
            variant={ButtonVariant.SecondaryBlue}
            onClick={onRegisterClick}
            loading={isLoading}
            fluid
          />

          <Button
            text="Забыли пароль?"
            variant={ButtonVariant.SecondaryGray}
            onClick={handleForgotPasswordClick}
            loading={isLoading}
            fluid
          />
        </div>
      </div>
    </form>
  )
}

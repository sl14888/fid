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
import {
  registerSchema,
  type RegisterFormData,
} from '@/lib/validations/auth.schema'
import { REGISTER_FORM_DEFAULT_VALUES } from '@/constants/forms'

import { RegisterFormProps } from './RegisterForm.types'
import styles from './RegisterForm.module.scss'
import { useMediaQuery } from '@/lib/hooks'
import { BREAKPOINTS } from '@/constants/breakpoints'

export const RegisterForm: FC<RegisterFormProps> = ({
  onSuccess,
  className,
}) => {
  const isMobile = useMediaQuery(BREAKPOINTS.SM)
  const { register: registerUser, isLoading } = useAuthStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_FORM_DEFAULT_VALUES,
  })

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (success) {
      onSuccess?.()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(styles.registerForm, className)}
    >
      <div className={styles.fields}>
        <FormField name="name" control={control}>
          <Input
            label="Имя"
            type="text"
            error={errors.name?.message}
            autoComplete="name"
            helperText="От 2 до 50 символов"
            disabled={isLoading}
            fluid
          />
        </FormField>

        <div className={styles.password}>
          <FormField name="password" control={control}>
            <PasswordInput
              label="Пароль"
              error={errors.password?.message}
              disabled={isLoading}
              autoComplete="new-password"
              helperText="От 12 символов: A-z, 0-9. Кроме: #,$,%"
            />
          </FormField>

          <FormField name="confirmPassword" control={control}>
            <PasswordInput
              label="Повторите пароль"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </FormField>
        </div>

        <FormField name="email" control={control}>
          <Input
            label="Электронная почта"
            type="email"
            error={errors.email?.message}
            disabled={isLoading}
            autoComplete="email"
            fluid
          />
        </FormField>
      </div>

      <div className={styles.submitButton}>
        <Button
          type="submit"
          text="Зарегистрироваться"
          variant={ButtonVariant.Primary}
          loading={isLoading}
          fluid={isMobile}
        />
      </div>
    </form>
  )
}

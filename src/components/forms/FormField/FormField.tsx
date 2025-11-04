'use client'

import { cloneElement } from 'react'
import { Controller, FieldPath, FieldValues } from 'react-hook-form'
import clsx from 'clsx'
import { FormFieldProps } from './FormField.types'
import styles from './FormField.module.scss'

/**
 * Обертка для интеграции input компонентов с react-hook-form
 *
 * @example
 * // Полный пример с Zod
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 * import { z } from 'zod'
 *
 * const schema = z.object({
 *   email: z.string().email('Неверный формат email'),
 *   password: z.string()
 *     .min(12, 'Минимум 12 символов')
 *     .regex(/[A-Za-z]/, 'Должен содержать буквы')
 *     .regex(/[0-9]/, 'Должен содержать цифры')
 * })
 *
 * function MyForm() {
 *   const { control, handleSubmit, formState: { errors } } = useForm({
 *     resolver: zodResolver(schema)
 *   })
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <FormField name="email" control={control}>
 *         <Input label="Email" error={errors.email?.message} />
 *       </FormField>
 *
 *       <FormField name="password" control={control}>
 *         <PasswordInput label="Пароль" error={errors.password?.message} />
 *       </FormField>
 *
 *       <Button type="submit">Отправить</Button>
 *     </form>
 *   )
 * }
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, children, className }: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={clsx(styles.formField, className)}>
          {cloneElement(children, field as never)}
        </div>
      )}
    />
  )
}

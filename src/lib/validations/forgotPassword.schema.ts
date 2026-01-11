import { z } from 'zod'

/**
 * Валидация email
 */
const emailValidation = z
  .string()
  .min(1, 'Email обязателен')
  .email('Некорректный email')

/**
 * Валидация пароля
 * Требования: от 12 символов, только A-z и 0-9, дефис разрешен
 */
const passwordValidation = z
  .string()
  .min(12, 'Пароль должен содержать минимум 12 символов')
  .regex(
    /^[A-Za-z0-9-]+$/,
    'Пароль может содержать только буквы (A-z), цифры (0-9) и дефис (-)'
  )

/**
 * Схема для шага 1: Ввод email
 */
export const forgotPasswordEmailSchema = z.object({
  email: emailValidation,
})

/**
 * Схема для шага 2: Ввод кода
 */
export const forgotPasswordCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Код обязателен')
    .regex(/^\d+$/, 'Код должен содержать только цифры'),
})

/**
 * Схема для шага 3: Ввод нового пароля
 */
export const forgotPasswordNewPasswordSchema = z
  .object({
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

/**
 * Типы для форм
 */
export type ForgotPasswordEmailFormData = z.infer<
  typeof forgotPasswordEmailSchema
>
export type ForgotPasswordCodeFormData = z.infer<
  typeof forgotPasswordCodeSchema
>
export type ForgotPasswordNewPasswordFormData = z.infer<
  typeof forgotPasswordNewPasswordSchema
>

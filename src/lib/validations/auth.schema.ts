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
 * Требования: от 12 символов, только A-z и 0-9, исключить #,$,%
 */
const passwordValidation = z
  .string()
  .min(12, 'Пароль должен содержать минимум 12 символов')
  .regex(
    /^[A-Za-z0-9-]+$/,
    'Пароль может содержать только буквы (A-z), цифры (0-9) и дефис (-)'
  )

/**
 * Валидация имени
 */
const nameValidation = z
  .string()
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(50, 'Имя не может быть длиннее 50 символов')

/**
 * Схема для формы логина
 */
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, 'Пароль обязателен'),
})

/**
 * Схема для формы регистрации
 */
export const registerSchema = z
  .object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

/**
 * Типы для форм
 */
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

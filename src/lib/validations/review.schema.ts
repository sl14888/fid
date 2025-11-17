import { z } from 'zod'

// Константы для валидации
const MAX_LENGTH_NAME = 255
const MAX_LENGTH_WEBSITE = 255
const MAX_LENGTH_TITLE = 500
const MAX_LENGTH_TEXT_FIELD = 3000

// Регулярное выражение для ИНН (10 или 12 цифр)
const INN_REGEX = /^\d{10}$|^\d{12}$/

// Валидация компании
export const companyFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Название компании обязательно')
    .max(
      MAX_LENGTH_NAME,
      `Название не должно превышать ${MAX_LENGTH_NAME} символов`
    ),

  employmentType: z
    .number('Выберите категорию')
    .int('Некорректная категория')
    .positive('Некорректная категория'),

  website: z
    .string()
    .max(
      MAX_LENGTH_WEBSITE,
      `Сайт не должен превышать ${MAX_LENGTH_WEBSITE} символов`
    )
    .optional()
    .or(z.literal('')),

  inn: z
    .string()
    .regex(INN_REGEX, 'ИНН должен содержать 10 или 12 цифр')
    .optional()
    .or(z.literal('')),

  isExistingCompany: z.boolean().optional(),
})

// Валидация отзыва
export const reviewFormSchema = z.object({
  grade: z
    .number('Оценка должна быть числом')
    .int('Оценка должна быть целым числом')
    .min(1, 'Минимальная оценка - 1')
    .max(5, 'Максимальная оценка - 5'),

  pluses: z
    .string()
    .max(
      MAX_LENGTH_TEXT_FIELD,
      `Плюсы не должны превышать ${MAX_LENGTH_TEXT_FIELD} символов`
    )
    .optional()
    .or(z.literal('')),

  minuses: z
    .string()
    .max(
      MAX_LENGTH_TEXT_FIELD,
      `Минусы не должны превышать ${MAX_LENGTH_TEXT_FIELD} символов`
    )
    .optional()
    .or(z.literal('')),

  description: z
    .string()
    .min(1, 'Комментарий обязателен')
    .max(
      MAX_LENGTH_TEXT_FIELD,
      `Комментарий не должен превышать ${MAX_LENGTH_TEXT_FIELD} символов`
    ),
})

// Схема для создания новой компании с отзывом
export const addReviewFormSchema = z.object({
  company: companyFormSchema,
  review: reviewFormSchema,
})

// Схема для добавления отзыва к существующей компании
export const addReviewToExistingCompanySchema = z.object({
  companyId: z.number().int().positive(),
  review: reviewFormSchema,
})

// Типы на основе схем
export type CompanyFormData = z.infer<typeof companyFormSchema>
export type ReviewFormData = z.infer<typeof reviewFormSchema>
export type AddReviewFormData = z.infer<typeof addReviewFormSchema>
export type AddReviewToExistingCompanyData = z.infer<
  typeof addReviewToExistingCompanySchema
>

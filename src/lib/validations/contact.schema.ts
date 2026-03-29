import { z } from 'zod'

const PHONE_REGEX = /^(\+7|8)[\s(]?\d{3}[)\s-]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/

export const contactSchema = z.object({
  contact: z
    .string()
    .min(1, 'Введите email или номер телефона')
    .superRefine((val, ctx) => {
      const isEmail = z.string().email().safeParse(val).success
      const isPhone = PHONE_REGEX.test(val)
      if (!isEmail && !isPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Введите корректный email или номер телефона',
        })
      }
    }),
  message: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

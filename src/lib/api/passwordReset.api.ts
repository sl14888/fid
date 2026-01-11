import { axiosPublicInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'

/**
 * Отправить код для восстановления пароля на email
 */
export const sendPasswordResetCode = async (email: string): Promise<void> => {
  await axiosPublicInstance.post(API_ENDPOINTS.PASSWORD_RESET.SEND_CODE, {
    email,
  })
}

/**
 * Сбросить пароль с использованием кода верификации
 */
export const resetPassword = async (data: {
  email: string
  verificationCode: number
  newPassword: string
}): Promise<void> => {
  await axiosPublicInstance.put(API_ENDPOINTS.PASSWORD_RESET.RESET, {
    currentPassword: '',
    newPassword: data.newPassword,
    verificationCode: data.verificationCode,
    email: data.email,
  })
}

/**
 * Экспорт всех функций
 */
export const passwordResetApi = {
  sendPasswordResetCode,
  resetPassword,
}

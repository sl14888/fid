import { axiosInstance, axiosPublicInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  UserDto,
  UpdateEmailRequest,
  UpdatePasswordRequest,
} from '@/types/user.types'

/**
 * Получить пользователя по ID
 */
export const getUserById = async (id: number): Promise<UserDto> => {
  const response = await axiosInstance.get<{ data: UserDto }>(
    API_ENDPOINTS.USERS.BY_ID(id)
  )
  return response.data.data
}

/**
 * Получить пользователя по email
 */
export const getUserByEmail = async (email: string): Promise<UserDto> => {
  const response = await axiosInstance.get<{ data: UserDto }>(
    API_ENDPOINTS.USERS.BY_EMAIL(email)
  )
  return response.data.data
}

/**
 * Обновить пароль пользователя
 */
export const updatePassword = async (
  userId: number,
  data: UpdatePasswordRequest
): Promise<void> => {
  await axiosInstance.put<void>(
    API_ENDPOINTS.USERS.UPDATE_PASSWORD(userId),
    data
  )
}

/**
 * Обновить email пользователя
 */
export const updateEmail = async (
  userId: number,
  data: UpdateEmailRequest
): Promise<UserDto> => {
  const response = await axiosInstance.put<{ data: UserDto }>(
    API_ENDPOINTS.USERS.UPDATE_EMAIL(userId),
    data
  )
  return response.data.data
}

/**
 * Отправить письмо для верификации email
 */
export const sendVerificationEmail = async (email: string): Promise<void> => {
  await axiosPublicInstance.post(API_ENDPOINTS.VERIFY.TOKEN_SEND, { email })
}

/**
 * Загрузить аватар пользователя
 */
export const uploadAvatar = async (file: File): Promise<UserDto> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.put<UserDto>(
    API_ENDPOINTS.USERS.UPDATE_AVATAR(),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * Экспорт всех функций
 */
export const usersApi = {
  getUserById,
  getUserByEmail,
  updatePassword,
  updateEmail,
  sendVerificationEmail,
  uploadAvatar,
}

import { axiosInstance } from './axios'
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
  const response = await axiosInstance.get<UserDto>(
    API_ENDPOINTS.USERS.BY_ID(id)
  )
  return response.data
}

/**
 * Получить пользователя по email
 */
export const getUserByEmail = async (email: string): Promise<UserDto> => {
  const response = await axiosInstance.get<UserDto>(
    API_ENDPOINTS.USERS.BY_EMAIL(email)
  )
  return response.data
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
): Promise<void> => {
  await axiosInstance.put<void>(API_ENDPOINTS.USERS.UPDATE_EMAIL(userId), data)
}

/**
 * Экспорт всех функций
 */
export const usersApi = {
  getUserById,
  getUserByEmail,
  updatePassword,
  updateEmail,
}

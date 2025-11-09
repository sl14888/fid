import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import { tokenStorage } from '@/lib/utils/storage'
import type {
  LoginRequest,
  RegistrationRequest,
  AuthenticationResponse,
} from '@/types/user.types'

/**
 * Авторизация пользователя
 */
export const login = async (
  data: LoginRequest
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<AuthenticationResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  )

  if (response.data.accessToken) {
    tokenStorage.setToken(response.data.accessToken)
  }

  return response.data
}

/**
 * Регистрация нового пользователя
 */
export const register = async (
  data: RegistrationRequest
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<AuthenticationResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  )

  if (response.data.accessToken) {
    tokenStorage.setToken(response.data.accessToken)
  }

  return response.data
}

/**
 * Выход из системы
 */
export const logout = (): void => {
  tokenStorage.removeToken()
}

/**
 * Проверка авторизации
 */
export const isAuthenticated = (): boolean => {
  return tokenStorage.hasToken()
}

/**
 * Получить токен
 */
export const getToken = (): string | null => {
  return tokenStorage.getToken()
}

export const authApi = {
  login,
  register,
  logout,
  isAuthenticated,
  getToken,
}

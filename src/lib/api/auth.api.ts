import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import { tokenStorage } from '@/lib/utils/storage'
import type {
  LoginRequest,
  RegistrationRequest,
  AuthenticationResponse,
} from '@/types/user.types'
import type { ResponseDto } from '@/types/api.types'

/**
 * Авторизация пользователя
 * Сохраняет токен только для подтвержденных пользователей
 */
export const login = async (
  data: LoginRequest
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<
    ResponseDto<AuthenticationResponse>
  >(API_ENDPOINTS.AUTH.LOGIN, data)

  // Данные находятся в обертке ResponseDto
  const authData = response.data.data

  if (!authData) {
    throw new Error('No data in response')
  }

  // Проверяем роль пользователя
  if (authData.userRole === 'RAW_USER') {
    throw new Error('EMAIL_NOT_VERIFIED')
  }

  if (authData.accessToken) {
    tokenStorage.setToken(authData.accessToken)
  } else {
    console.warn('[API] No accessToken in response!')
  }

  return authData
}

/**
 * Регистрация нового пользователя
 */
export const register = async (
  data: RegistrationRequest
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<
    ResponseDto<AuthenticationResponse>
  >(API_ENDPOINTS.AUTH.REGISTER, data)

  // Данные находятся в обертке ResponseDto
  const authData = response.data.data

  if (!authData) {
    throw new Error('No data in response')
  }

  // НЕ сохраняем токен при регистрации
  // Пользователь должен подтвердить email и затем войти через login

  return authData
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

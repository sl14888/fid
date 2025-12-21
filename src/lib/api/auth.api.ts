import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  LoginRequest,
  RegistrationRequest,
  AuthenticationResponse,
} from '@/types/user.types'
import type { ResponseDto } from '@/types/api.types'

/**
 * Авторизация пользователя
 * Токены теперь сохраняются в store, не здесь
 */
export const login = async (
  data: LoginRequest
): Promise<AuthenticationResponse> => {
  const response = await axiosInstance.post<
    ResponseDto<AuthenticationResponse>
  >(API_ENDPOINTS.AUTH.LOGIN, data)

  const authData = response.data.data

  if (!authData) {
    throw new Error('No data in response')
  }

  // Проверяем роль пользователя
  if (authData.userRole === 'RAW_USER') {
    throw new Error('EMAIL_NOT_VERIFIED')
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

  const authData = response.data.data

  if (!authData) {
    throw new Error('No data in response')
  }

  // НЕ сохраняем токен при регистрации
  // Пользователь должен подтвердить email и затем войти через login

  return authData
}

/**
 * Обновление access и refresh токенов
 * Бэкенд автоматически берет refresh_token из куки
 * и устанавливает новые куки access_token и refresh_token
 */
export const refresh = async (): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH)
  // Бэкенд сам устанавливает новые куки через Set-Cookie
}

export const authApi = {
  login,
  register,
  refresh,
}

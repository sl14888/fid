import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import toast from 'react-hot-toast'
import { tokenStorage } from '@/lib/utils/storage'
import { HttpStatus, ERROR_MESSAGES } from '@/constants/api'
import type { ResponseDto } from '@/types/api.types'

/**
 * Request interceptor - добавляет токен в заголовок Authorization
 */
export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = tokenStorage.getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
}

/**
 * Request error interceptor
 */
export const requestErrorInterceptor = (error: unknown): Promise<never> => {
  return Promise.reject(error)
}

/**
 * Response interceptor - извлекает data из ResponseDto
 */
export const responseInterceptor = <T>(
  response: AxiosResponse<ResponseDto<T>>
): AxiosResponse<T> => {
  // Извлекаем data из ResponseDto для удобства использования
  return {
    ...response,
    data: response.data.data as T,
  }
}

/**
 * Response error interceptor - обрабатывает ошибки
 */
export const responseErrorInterceptor = (
  error: AxiosError<ResponseDto<unknown>>
): Promise<never> => {
  const status = error.response?.status
  const message = error.response?.data?.message

  switch (status) {
    case HttpStatus.UPGRADE_REQUIRED:
      // Токен истёк
      tokenStorage.removeToken()
      toast.error(ERROR_MESSAGES.TOKEN_EXPIRED)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      break

    case HttpStatus.UNAUTHORIZED:
      toast.error(message || ERROR_MESSAGES.UNAUTHORIZED)
      break

    case HttpStatus.FORBIDDEN:
      toast.error(message || ERROR_MESSAGES.FORBIDDEN)
      break

    case HttpStatus.NOT_FOUND:
      toast.error(message || ERROR_MESSAGES.NOT_FOUND)
      break

    case HttpStatus.INTERNAL_SERVER_ERROR:
      toast.error(message || ERROR_MESSAGES.SERVER_ERROR)
      break

    default:
      if (status && status >= HttpStatus.BAD_REQUEST) {
        toast.error(message || ERROR_MESSAGES.DEFAULT)
      }
      break
  }

  return Promise.reject(error)
}

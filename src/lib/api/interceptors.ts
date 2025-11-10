import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { axiosInstance } from './axios'
import { tokenStorage } from '@/lib/utils/storage'
import { HttpStatus } from '@/constants/api'

/**
 * Request interceptor - добавляем токен к каждому запросу
 */
export const setupRequestInterceptor = () => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.getToken()

      if (token && config.headers) {
        config.headers.Authorization = `${token}`
      }

      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
}

/**
 * Response interceptor - обработка ошибок
 */
export const setupResponseInterceptor = () => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error: AxiosError) => {
      // Обработка Network Error
      if (!error.response) {
        toast.error('Ошибка соединения с сервером')
        return Promise.reject(error)
      }

      const status = error.response?.status
      const errorData = error.response?.data as {
        message?: string
        details?: string
      }

      const backendMessage = errorData?.message || errorData?.details

      if (backendMessage) {
        toast.error(backendMessage)

        if (status === HttpStatus.UPGRADE_REQUIRED) {
          tokenStorage.removeToken()
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/'
            }, 1000)
          }
        }

        return Promise.reject(error)
      }

      switch (status) {
        case HttpStatus.UNAUTHORIZED: // 401 - Не авторизован
          toast.error('Неверный email или пароль')
          break

        case HttpStatus.FORBIDDEN: // 403 - Доступ запрещен
          toast.error('Доступ запрещен. Подтвердите email')
          break

        case HttpStatus.CONFLICT: // 409 - Конфликт
          toast.error('Пользователь с таким email уже существует')
          break

        case HttpStatus.BAD_REQUEST: // 400 - Неверные данные
          toast.error('Неверные данные. Проверьте введенную информацию')
          break

        case HttpStatus.UPGRADE_REQUIRED: // 426 - Токен истек
          tokenStorage.removeToken()
          toast.error('Сессия истекла. Пожалуйста, войдите снова')
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/'
            }, 1000)
          }
          break

        case HttpStatus.INTERNAL_SERVER_ERROR: // 500 - Ошибка сервера
          toast.error('Ошибка сервера. Попробуйте позже')
          break

        default:
          toast.error('Произошла ошибка. Попробуйте снова')
      }

      return Promise.reject(error)
    }
  )
}

/**
 * Инициализация всех interceptors
 */
export const setupInterceptors = () => {
  setupRequestInterceptor()
  setupResponseInterceptor()
}

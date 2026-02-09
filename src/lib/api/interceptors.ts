import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { axiosInstance } from './axios'
import { ERROR_MESSAGES, HttpStatus } from '@/constants/api'
import { useAuthStore } from '@/store/auth.store'

/**
 * Queue для управления одновременными 401 запросами
 */
interface QueueItem {
  resolve: () => void
  reject: (error: Error) => void
}

let isRefreshing = false
let refreshQueue: QueueItem[] = []

/**
 * Обработчик очереди запросов после успешного refresh
 */
const processQueue = (error: Error | null) => {
  refreshQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  refreshQueue = []
}

/**
 * Request interceptor
 * Бэкенд автоматически берет токен из куки access_token
 * withCredentials: true обеспечивает автоматическую передачу кук
 *
 * @returns ID interceptor-а для последующего удаления через eject()
 */
export const setupRequestInterceptor = () => {
  return axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Бэкенд берет токен из куки access_token
      // withCredentials: true автоматически передает куки
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
}

/**
 * Response interceptor - автоматический refresh при 401
 *
 * @returns ID interceptor-а для последующего удаления через eject()
 */
export const setupResponseInterceptor = () => {
  return axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
        skipErrorToast?: boolean
      }

      // Обработка Network Error
      if (!error.response) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR)
        return Promise.reject(error)
      }

      const status = error.response?.status
      const errorData = error.response?.data as {
        message?: string
        details?: string
      }
      const backendMessage = errorData?.message || errorData?.details

      // ОБРАБОТКА 401 - АВТОМАТИЧЕСКИЙ REFRESH
      // Бэкенд возвращает 401 когда токен протух или невалиден
      if (status === HttpStatus.UNAUTHORIZED && !originalRequest._retry) {
        const isAuthRequest =
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/registration') ||
          // В будущем убрать
          originalRequest.url?.includes('/auth/refresh')

        if (isAuthRequest) {
          return Promise.reject(error)
        }

        originalRequest._retry = true

        // Если refresh уже идет - добавляем в очередь
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({
              resolve: () => {
                // Бэкенд обновил куки через Set-Cookie
                // withCredentials: true автоматически передаст их в повторном запросе
                resolve(axiosInstance(originalRequest))
              },
              reject: (err: Error) => reject(err),
            })
          })
        }

        isRefreshing = true

        try {
          const { refreshTokens } = useAuthStore.getState()
          const success = await refreshTokens()

          if (success) {
            // Обработка очереди - бэкенд обновил куки
            processQueue(null)

            // Повторяем оригинальный запрос
            // Куки автоматически передаются через withCredentials: true
            return axiosInstance(originalRequest)
          } else {
            // Refresh не удался
            processQueue(new Error('Refresh failed'))
            toast.error(ERROR_MESSAGES.SESSION_EXPIRED)

            if (typeof window !== 'undefined') {
              setTimeout(() => {
                window.location.href = '/?auth=required'
              }, 1000)
            }

            return Promise.reject(error)
          }
        } catch (refreshError) {
          processQueue(refreshError as Error)
          toast.error(ERROR_MESSAGES.SESSION_EXPIRED)

          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/?auth=required'
            }, 1000)
          }

          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Обработка других ошибок
      if (!originalRequest.skipErrorToast) {
        if (!backendMessage) {
          switch (status) {
            case HttpStatus.FORBIDDEN:
              toast.error(ERROR_MESSAGES.FORBIDDEN)
              break
            case HttpStatus.CONFLICT:
              toast.error(ERROR_MESSAGES.CONFLICT)
              break
            case HttpStatus.BAD_REQUEST:
              toast.error(ERROR_MESSAGES.BAD_REQUEST)
              break
            case HttpStatus.INTERNAL_SERVER_ERROR:
              toast.error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
              break
            default:
              toast.error(ERROR_MESSAGES.DEFAULT)
          }
        } else {
          toast.error(backendMessage)
        }
      }

      return Promise.reject(error)
    }
  )
}

/**
 * Флаг для предотвращения повторной инициализации interceptors
 */
let interceptorsInitialized = false

/**
 * Инициализация всех interceptors
 * Вызывается только один раз благодаря флагу interceptorsInitialized
 *
 * @returns Cleanup функция для удаления всех interceptors
 */
export const setupInterceptors = () => {
  // Если уже инициализированы - возвращаем no-op cleanup
  if (interceptorsInitialized) {
    return () => {}
  }

  interceptorsInitialized = true

  const requestInterceptorId = setupRequestInterceptor()
  const responseInterceptorId = setupResponseInterceptor()

  // Cleanup функция для удаления interceptors
  return () => {
    axiosInstance.interceptors.request.eject(requestInterceptorId)
    axiosInstance.interceptors.response.eject(responseInterceptorId)
    interceptorsInitialized = false
  }
}

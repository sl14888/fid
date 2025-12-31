import axios, {
  AxiosAdapter,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { API_BASE_URL } from '@/constants/api'

/**
 * Базовый axios instance с настроенным базовым URL
 * withCredentials: true - для автоматической передачи кук
 * Interceptors настраиваются в AuthProvider (только на клиенте)
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Кастомный adapter для axios, который использует fetch с credentials: 'omit'
 */
const fetchAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> => {
  const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url

  const response = await fetch(url, {
    method: config.method?.toUpperCase(),
    headers: config.headers as HeadersInit,
    body: config?.data,
    credentials: 'omit',
  })

  const data = await response.json()

  const headers: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    headers[key] = value
  })

  if (!response.ok) {
    const error = new Error(`HTTP Error: ${response.status}`) as Error & {
      response?: {
        status: number
        statusText: string
        data: unknown
      }
    }
    error.response = {
      status: response.status,
      statusText: response.statusText,
      data,
    }
    throw error
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers,
    config,
  } as AxiosResponse
}

export const axiosPublicInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  adapter: fetchAdapter,
})

export default axiosInstance

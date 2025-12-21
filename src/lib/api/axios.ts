import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'

/**
 * Базовый axios instance с настроенным базовым URL
 * withCredentials: true - для автоматической передачи кук
 * Interceptors настраиваются в AuthProvider (только на клиенте)
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Автоматическая передача кук
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default axiosInstance

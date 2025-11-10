import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'

/**
 * Базовый axios instance с настроенным базовым URL
 * Interceptors настраиваются отдельно через setupInterceptors() из AuthProvider
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default axiosInstance

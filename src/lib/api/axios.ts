import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'
import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from './interceptors'

/**
 * Базовый axios instance с настроенным базовым URL
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Подключение interceptors
 */
axiosInstance.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
)

axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
)

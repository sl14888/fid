import { STORAGE_KEYS } from '@/constants/api'

/**
 * Проверка доступности localStorage (SSR safety)
 */
const isLocalStorageAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Проверка доступности cookies (SSR safety)
 */
const isCookiesAvailable = (): boolean => {
  return typeof document !== 'undefined'
}

/**
 * Сохранить значение в localStorage
 */
export const setItem = (key: string, value: string): void => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(key, value)
  }
}

/**
 * Получить значение из localStorage
 */
export const getItem = (key: string): string | null => {
  if (isLocalStorageAvailable()) {
    return localStorage.getItem(key)
  }
  return null
}

/**
 * Удалить значение из localStorage
 */
export const removeItem = (key: string): void => {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(key)
  }
}

/**
 * Очистить весь localStorage
 */
export const clear = (): void => {
  if (isLocalStorageAvailable()) {
    localStorage.clear()
  }
}

/**
 * Установить cookie
 */
const setCookie = (name: string, value: string, days: number = 1): void => {
  if (isCookiesAvailable()) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }
}

/**
 * Получить cookie
 */
const getCookie = (name: string): string | null => {
  if (isCookiesAvailable()) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

/**
 * Удалить cookie
 */
const removeCookie = (name: string): void => {
  if (isCookiesAvailable()) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

/**
 * Утилиты для работы с токеном авторизации
 * Токен сохраняется и в localStorage (для клиента) и в cookies (для middleware)
 */
export const tokenStorage = {
  /**
   * Сохранить токен (и в localStorage и в cookies)
   */
  setToken: (token: string): void => {
    // Сохраняем в localStorage для клиентского кода
    setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
    // Сохраняем в cookies для middleware (24 часа = 1 день)
    setCookie('auth-token', token, 1)
  },

  /**
   * Получить токен
   */
  getToken: (): string | null => {
    // Сначала пробуем получить из localStorage
    const token = getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) return token
    // Если нет в localStorage, пробуем из cookies
    return getCookie('auth-token')
  },

  /**
   * Удалить токен (и из localStorage и из cookies)
   */
  removeToken: (): void => {
    removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    removeCookie('auth-token')
  },

  /**
   * Проверить наличие токена
   */
  hasToken: (): boolean => {
    return !!tokenStorage.getToken()
  },
}

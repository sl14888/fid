import { STORAGE_KEYS } from '@/constants/api'

/**
 * Проверка доступности localStorage (SSR safety)
 */
const isLocalStorageAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
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
 * Утилиты для работы с токеном авторизации
 */
export const tokenStorage = {
  /**
   * Сохранить токен
   */
  setToken: (token: string): void => {
    setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  /**
   * Получить токен
   */
  getToken: (): string | null => {
    return getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * Удалить токен
   */
  removeToken: (): void => {
    removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * Проверить наличие токена
   */
  hasToken: (): boolean => {
    return !!tokenStorage.getToken()
  },
}

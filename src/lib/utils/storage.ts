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

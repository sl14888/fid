import { useState, useEffect, useCallback } from 'react'

/**
 * Универсальный хук для работы с sessionStorage
 * @param key - ключ для хранения в sessionStorage
 * @param initialValue - начальное значение
 * @returns [значение, функция для установки значения, функция для удаления]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Состояние для хранения значения с lazy initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR-safe проверка
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      // Получаем значение из sessionStorage
      const item = window.sessionStorage.getItem(key)
      // Парсим JSON или возвращаем начальное значение
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Функция для установки значения
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Позволяет передавать функцию для обновления значения (как в useState)
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Сохраняем в состояние
        setStoredValue(valueToStore)

        // Сохраняем в sessionStorage
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Функция для удаления значения
  const removeValue = useCallback(() => {
    try {
      // Удаляем из sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
      }
      // Сбрасываем на начальное значение
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Слушаем изменения в других вкладках (для sessionStorage это не так актуально, но полезно)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing sessionStorage event for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

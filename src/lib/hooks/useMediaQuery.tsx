'use client'

import { useEffect, useState } from 'react'

/**
 * Хук для отслеживания media query
 * @param maxWidth - максимальная ширина в пикселях (например, 640 для мобильных устройств)
 * @returns true если ширина экрана меньше или равна maxWidth
 */
export const useMediaQuery = (maxWidth: number): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches
  })

  useEffect(() => {
    // Создаем media query
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`)

    // Обработчик изменения
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Синхронизируем состояние при монтировании
    if (mediaQuery.matches !== matches) {
      queueMicrotask(() => {
        setMatches(mediaQuery.matches)
      })
    }

    // Подписываемся на изменения
    mediaQuery.addEventListener('change', handleChange)

    // Отписываемся при размонтировании
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [maxWidth, matches])

  return matches
}

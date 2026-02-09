'use client'

import { useEffect, useState } from 'react'

/**
 * Хук для отслеживания media query
 * @param maxWidth - максимальная ширина в пикселях (например, 640 для мобильных устройств)
 * @returns true если ширина экрана меньше или равна maxWidth
 */
export const useMediaQuery = (maxWidth: number): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`)

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches)
    }

    handleChange(mediaQuery)

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [maxWidth])

  return matches
}

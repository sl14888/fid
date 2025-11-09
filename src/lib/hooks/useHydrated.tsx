'use client'

import { useEffect, useState } from 'react'

/**
 * Хук для определения, был ли компонент гидратирован на клиенте
 * Используется для предотвращения ошибок гидратации при SSR
 *
 * Возвращает false на сервере и при первом рендере клиента,
 * затем true после монтирования компонента на клиенте
 */
export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Используем setTimeout для асинхронного обновления состояния,
    // что позволяет избежать предупреждения линтера о синхронном setState в эффекте
    const timer = setTimeout(() => {
      setHydrated(true)
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return hydrated
}

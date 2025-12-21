'use client'

import { useEffect, ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { setupInterceptors } from '@/lib/api/interceptors'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Провайдер для инициализации авторизации при загрузке приложения
 * Восстанавливает сессию через refresh token
 * Настраивает interceptors для API запросов (только на клиенте)
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const searchParams = useSearchParams()
  const initAuth = useAuthStore((state) => state.initAuth)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    // Настраиваем interceptors один раз при mount
    // Флаг внутри setupInterceptors() предотвращает повторную инициализацию
    const cleanupInterceptors = setupInterceptors()

    return cleanupInterceptors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Инициализация auth при загрузке
  useEffect(() => {
    // TODO: Обработка ?auth=required - redirect из middleware
    // Когда middleware не находит токены, он редиректит на /?auth=required
    // Проблема: user может остаться в localStorage, но куки удалены
    // Решение: очищаем store и показываем сообщение
    const authRequired = searchParams.get('auth')
    if (authRequired === 'required') {
      // Очищаем store - куки истекли или отсутствуют
      logout()
      toast.error('Необходима авторизация. Пожалуйста, войдите в систему')

      // Очищаем параметр из URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/')
      }
    } else {
      // Инициализируем auth при первой загрузке
      // initAuth восстанавливает состояние из localStorage
      // Refresh вызовется автоматически при первом API запросе если токен истек
      initAuth().catch((error) => {
        console.error('Failed to initialize auth:', error)
      })
    }
  }, [initAuth, logout, searchParams])

  return <>{children}</>
}

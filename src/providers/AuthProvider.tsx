'use client'

import { useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { setupInterceptors } from '@/lib/api/interceptors'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Провайдер для инициализации авторизации при загрузке приложения
 * Восстанавливает состояние аутентификации из localStorage
 * Настраивает interceptors для API запросов
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initAuth = useAuthStore((state) => state.initAuth)

  useEffect(() => {
    // Настраиваем interceptors для axios
    setupInterceptors()

    // Инициализируем auth при первой загрузке
    initAuth()
  }, [initAuth])

  return <>{children}</>
}

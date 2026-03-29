'use client'

import { useEffect, ReactNode, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { setupInterceptors } from '@/lib/api/interceptors'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Внутренний компонент для инициализации авторизации
 */
function AuthInitializer() {
  const initAuth = useAuthStore((state) => state.initAuth)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    // Проверяем только локальный флаг для этой вкладки
    // НЕ используем глобальный флаг, чтобы каждая вкладка могла инициализироваться независимо
    if (hasInitializedRef.current) {
      return
    }

    // Вызываем initAuth для этой вкладки
    initAuth().catch((error) => {
      console.error('Failed to initialize auth:', error)
    })

    hasInitializedRef.current = true
  }, [initAuth])

  return null
}

/**
 * Провайдер для инициализации авторизации при загрузке приложения
 * Восстанавливает сессию через refresh token
 * Настраивает interceptors для API запросов (только на клиенте)
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    const cleanupInterceptors = setupInterceptors()
    return cleanupInterceptors
  }, [])

  return (
    <>
      <AuthInitializer />
      {children}
    </>
  )
}

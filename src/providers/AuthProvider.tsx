'use client'

import { useEffect, ReactNode, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { setupInterceptors } from '@/lib/api/interceptors'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Внутренний компонент для работы с searchParams
 * Должен быть обернут в Suspense
 */
function AuthInitializer() {
  const searchParams = useSearchParams()
  const initAuth = useAuthStore((state) => state.initAuth)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const authRequired = searchParams.get('auth')
    if (authRequired === 'required') {
      logout()
      toast.error('Необходима авторизация. Пожалуйста, войдите в систему')

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/')
      }
    } else {
      initAuth().catch((error) => {
        console.error('Failed to initialize auth:', error)
      })
    }
  }, [initAuth, logout, searchParams])

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
      <Suspense fallback={null}>
        <AuthInitializer />
      </Suspense>
      {children}
    </>
  )
}

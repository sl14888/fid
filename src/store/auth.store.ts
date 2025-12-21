import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'

import type {
  AuthenticationResponse,
  LoginRequest,
  RegistrationRequest,
} from '@/types/user.types'
import type { Role } from '@/types/common.types'

interface User {
  id: number
  name?: string
  email: string
  role: Role
}

interface AuthState {
  // Данные пользователя
  user: User | null

  // Статусы загрузки
  isLoading: boolean
  isAuthenticated: boolean
  isRefreshing: boolean

  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegistrationRequest) => Promise<boolean>
  logout: () => void
  refreshTokens: () => Promise<boolean>
  setUser: (user: User) => void
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isRefreshing: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true })

        try {
          const response: AuthenticationResponse =
            await api.auth.login(credentials)

          const user: User = {
            id: response.userId,
            email: response.email,
            role: response.userRole,
          }

          // Токены управляются бэкендом через куки
          // Сохраняем только данные пользователя
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success('Вы успешно вошли в систему')
          return true
        } catch (error) {
          set({ isLoading: false })

          if (
            error instanceof Error &&
            error.message === 'EMAIL_NOT_VERIFIED'
          ) {
            toast.error(
              'Подтвердите email для входа. Проверьте почту и перейдите по ссылке в письме'
            )
          }

          return false
        }
      },

      /**
       * Регистрация нового пользователя
       * НЕ авторизует пользователя - требуется подтверждение email
       */
      register: async (data: RegistrationRequest) => {
        set({ isLoading: true })

        try {
          await api.auth.register(data)

          set({ isLoading: false })

          toast.success(
            'Регистрация успешна! Проверьте почту и подтвердите email для входа'
          )

          return true
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      /**
       * Выход из системы
       */
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
        // TODO: вызвать logout endpoint если он есть
        // для удаления кук на бэкенде
      },

      /**
       * Обновление токенов через /api/v1/auth/refresh
       * Бэкенд автоматически берет refresh_token из куки
       * и устанавливает новые куки
       */
      refreshTokens: async () => {
        const { isRefreshing } = get()

        // Если уже идет refresh - ждем его завершения
        if (isRefreshing) {
          return new Promise<boolean>((resolve) => {
            const checkInterval = setInterval(() => {
              const state = get()
              if (!state.isRefreshing) {
                clearInterval(checkInterval)
                resolve(state.isAuthenticated)
              }
            }, 100)
          })
        }

        set({ isRefreshing: true })

        try {
          // Просто вызываем endpoint - бэкенд сам обновит куки
          await api.auth.refresh()

          set({
            isRefreshing: false,
            isAuthenticated: true,
          })

          return true
        } catch (error) {
          // Refresh не удался - разлогиниваем
          set({
            user: null,
            isAuthenticated: false,
            isRefreshing: false,
          })

          return false
        }
      },

      /**
       * Установить данные пользователя
       */
      setUser: (user: User) => {
        set({ user })
      },

      /**
       * Инициализация auth при загрузке приложения
       * Просто восстанавливаем состояние из persist
       * Refresh вызовется автоматически при первом API запросе если токен истек (через interceptor)
       */
      initAuth: async () => {
        const { user } = get()

        // Если user есть - восстанавливаем isAuthenticated
        if (user) {
          set({ isAuthenticated: true })
          // НЕ вызываем refresh! Пусть токен проверится при первом API запросе
          // Если токен истек - interceptor автоматически вызовет refresh при 401
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        // НЕ сохраняем токены - accessToken только в памяти
        // refreshToken в HttpOnly cookie на бэкенде
      }),
    }
  )
)

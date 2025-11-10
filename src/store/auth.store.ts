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

  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegistrationRequest) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
  setUser: (user: User) => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true })

        try {
          const response: AuthenticationResponse =
            await api.auth.login(credentials)

          const user: User = {
            email: response.email,
            role: response.userRole,
          }

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
        api.auth.logout()
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      /**
       * Проверка авторизации при загрузке приложения
       */
      checkAuth: () => {
        const isAuthenticated = api.auth.isAuthenticated()
        const currentState = get()

        if (isAuthenticated && !currentState.user) {
          // Если токен есть, но данных пользователя нет - оставляем как есть
          // Данные пользователя загрузятся из persist storage
          set({ isAuthenticated: true })
        } else if (!isAuthenticated) {
          set({ isAuthenticated: false, user: null })
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
       * Проверяет наличие токена и восстанавливает состояние из localStorage
       */
      initAuth: () => {
        const hasToken = api.auth.isAuthenticated()
        const currentState = get()

        // Если токен есть и пользователь сохранен в persist storage
        if (hasToken && currentState.user) {
          set({ isAuthenticated: true })
        }
        // Если токена нет - очищаем состояние
        else if (!hasToken) {
          set({ isAuthenticated: false, user: null })
        }
        // Если токен есть, но пользователя нет - удаляем токен и очищаем состояние
        else if (hasToken && !currentState.user) {
          api.auth.logout()
          set({ isAuthenticated: false, user: null })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          // После восстановления из localStorage проверяем валидность токена
          if (state) {
            const hasToken = api.auth.isAuthenticated()
            // Если токена нет, но state говорит что авторизован - очищаем
            if (!hasToken && state.isAuthenticated) {
              state.isAuthenticated = false
              state.user = null
            }
            // Если токен есть и есть пользователь - подтверждаем авторизацию
            else if (hasToken && state.user) {
              state.isAuthenticated = true
            }
          }
        }
      },
    }
  )
)

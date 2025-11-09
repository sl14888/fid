import { create } from 'zustand'
import { api } from '@/lib/api'

import type {
  AuthenticationResponse,
  LoginRequest,
  RegistrationRequest,
} from '@/types/user.types'
import type { Role } from '@/types/common.types'

interface AuthState {
  // Данные пользователя
  user: {
    email: string
    role: Role
  } | null

  // Статусы загрузки
  isLoading: boolean
  isAuthenticated: boolean

  // Ошибки
  error: string | null

  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegistrationRequest) => Promise<void>
  logout: () => void
  checkAuth: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: api.auth.isAuthenticated(),
  error: null,

  /**
   * Авторизация пользователя
   */
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null })

    try {
      const response: AuthenticationResponse = await api.auth.login(credentials)

      set({
        user: {
          email: response.email,
          role: response.userRole as Role,
        },
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: 'Ошибка авторизации',
        isLoading: false,
      })

      throw error
    }
  },

  /**
   * Регистрация нового пользователя
   */
  register: async (data: RegistrationRequest) => {
    set({ isLoading: true, error: null })

    try {
      const response: AuthenticationResponse = await api.auth.register(data)

      set({
        user: {
          email: response.email,
          role: response.userRole as Role,
        },
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: 'Ошибка регистрации',
        isLoading: false,
      })

      throw error
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
      error: null,
    })
  },

  /**
   * Проверка авторизации при загрузке приложения
   */
  checkAuth: () => {
    const isAuthenticated = api.auth.isAuthenticated()
    set({ isAuthenticated })
  },

  /**
   * Очистить ошибку
   */
  clearError: () => {
    set({ error: null })
  },
}))

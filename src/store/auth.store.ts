import { create } from 'zustand'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
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
  user: User | null

  isLoading: boolean
  isAuthenticated: boolean
  isRefreshing: boolean
  isInitializing: boolean

  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegistrationRequest) => Promise<boolean>
  logout: () => Promise<void>
  refreshTokens: () => Promise<boolean>
  setUser: (user: User) => void
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isRefreshing: false,
  isInitializing: true,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true })

    try {
      const response: AuthenticationResponse = await api.auth.login(credentials)

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

      if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
        toast.error(
          'Подтвердите email для входа. Проверьте почту и перейдите по ссылке в письме'
        )
      } else {
        toast.error('Неверный email или пароль')
      }

      return false
    }
  },

  /**
   * Регистрация нового пользователя
   * Бэкенд возвращает токены при регистрации - автоматически авторизуем
   */
  register: async (data: RegistrationRequest) => {
    set({ isLoading: true })

    try {
      const response: AuthenticationResponse = await api.auth.register(data)

      // Бэкенд возвращает токены при регистрации
      // API proxy устанавливает их в куки автоматически
      // Создаем user объект и авторизуем
      const user: User = {
        id: response.userId,
        email: response.email,
        role: response.userRole,
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      toast.success(
        'Регистрация успешна! Проверьте почту для подтверждения email'
      )

      return true
    } catch {
      set({ isLoading: false })
      return false
    }
  },

  /**
   * Выход из системы
   * Вызываем /api/auth/logout для очистки HttpOnly кук на сервере
   */
  logout: async () => {
    try {
      // Вызываем наш Next.js endpoint для очистки HttpOnly кук
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Продолжаем logout даже если запрос упал
    }

    set({
      user: null,
      isAuthenticated: false,
    })
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
   * Проверяем валидность сессии через API
   * HttpOnly cookies недоступны через document.cookie, поэтому просто делаем запрос
   */
  initAuth: async () => {
    set({ isInitializing: true })

    try {
      const profileData = await api.users.getUserProfile(true)

      const user: User = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.mail,
        role: profileData.role,
      }

      set({
        user,
        isAuthenticated: true,
        isInitializing: false,
      })
    } catch (error) {
      // Если получили ошибку - сессии нет или она невалидна
      // Обрабатываем как 401, так и 403
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status

        // 401 или 403 при /profile означает что сессии нет
        if (status === 401 || status === 403) {
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
          })
        }
      } else {
        // Сетевая ошибка - завершаем инициализацию
        set({ isInitializing: false })
      }
    }
  },
}))

/**
 * Очистка устаревшего auth-storage из localStorage
 * Эта функция вызывается один раз при загрузке модуля
 */
if (typeof window !== 'undefined') {
  const oldAuthStorage = localStorage.getItem('auth-storage')
  if (oldAuthStorage) {
    console.log('Removing deprecated auth-storage from localStorage')
    localStorage.removeItem('auth-storage')
  }
}

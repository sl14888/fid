import { create } from 'zustand'
import { api } from '@/lib/api'
import type {
  UserDto,
  UpdateEmailRequest,
  UpdatePasswordRequest,
} from '@/types/user.types'

interface UsersState {
  // Данные
  currentUser: UserDto | null

  // Статусы загрузки
  isLoading: boolean
  error: string | null

  // Actions
  fetchUserById: (id: number) => Promise<void>
  fetchUserByEmail: (email: string) => Promise<void>
  updatePassword: (userId: number, data: UpdatePasswordRequest) => Promise<void>
  updateEmail: (userId: number, data: UpdateEmailRequest) => Promise<void>
  clearCurrentUser: () => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
}

export const useUsersStore = create<UsersState>((set) => ({
  ...initialState,

  /**
   * Получить пользователя по ID
   */
  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null })

    try {
      const user = await api.users.getUserById(id)
      set({
        currentUser: user,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки пользователя по ID: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Получить пользователя по email
   */
  fetchUserByEmail: async (email: string) => {
    set({ isLoading: true, error: null })

    try {
      const user = await api.users.getUserByEmail(email)
      set({
        currentUser: user,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки пользователя по email: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Обновить пароль пользователя
   */
  updatePassword: async (userId: number, data: UpdatePasswordRequest) => {
    set({ isLoading: true, error: null })

    try {
      await api.users.updatePassword(userId, data)
      set({ isLoading: false })
    } catch (error) {
      set({
        error: `Ошибка обновления пароля: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Обновить email пользователя
   */
  updateEmail: async (userId: number, data: UpdateEmailRequest) => {
    set({ isLoading: true, error: null })

    try {
      await api.users.updateEmail(userId, data)
      set({ isLoading: false })
    } catch (error) {
      set({
        error: `Ошибка обновления email: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Очистить текущего пользователя
   */
  clearCurrentUser: () => {
    set({ currentUser: null })
  },

  /**
   * Очистить ошибку
   */
  clearError: () => {
    set({ error: null })
  },

  /**
   * Сбросить состояние к начальному
   */
  reset: () => {
    set(initialState)
  },
}))

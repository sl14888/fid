import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { api } from '@/lib/api'
import type {
  UserDto,
  UserSearchResultDto,
  UpdateEmailRequest,
  UpdatePasswordRequest,
} from '@/types/user.types'

interface UsersState {
  currentUser: UserDto | null
  searchResults: UserSearchResultDto[]

  isLoading: boolean
  isSearching: boolean
  isSendingVerification: boolean
  isUploadingAvatar: boolean
  error: string | null
  uploadError: string | null

  fetchUserById: (id: number) => Promise<void>
  updatePassword: (userId: number, data: UpdatePasswordRequest) => Promise<void>
  updateEmail: (userId: number, data: UpdateEmailRequest) => Promise<void>
  sendVerificationEmail: (email: string) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<boolean>
  searchUsers: (query: string) => Promise<void>
  clearSearchResults: () => void
  clearCurrentUser: () => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  currentUser: null,
  searchResults: [],
  isLoading: false,
  isSearching: false,
  isSendingVerification: false,
  isUploadingAvatar: false,
  error: null,
  uploadError: null,
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
      const updatedUser = await api.users.updateEmail(userId, data)
      set({
        currentUser: updatedUser,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка обновления email: ${error}`,
        isLoading: false,
      })
      throw error
    }
  },

  /**
   * Отправить письмо для верификации email
   */
  sendVerificationEmail: async (email: string) => {
    set({ isSendingVerification: true, error: null })

    try {
      await api.users.sendVerificationEmail(email)
      set({ isSendingVerification: false })
      return true
    } catch (error) {
      set({
        error: `Не удалось отправить письмо: ${error}`,
        isSendingVerification: false,
      })
      return false
    }
  },

  /**
   * Загрузить аватар пользователя
   */
  uploadAvatar: async (file: File) => {
    set({ isUploadingAvatar: true, uploadError: null })

    try {
      const updatedUser = await api.users.uploadAvatar(file)

      // Обновляем только avatar, не трогая остальные поля currentUser
      set((state) => ({
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              avatar: updatedUser.avatar,
            }
          : null,
        isUploadingAvatar: false,
      }))

      toast.success('Аватар успешно обновлен')
      return true
    } catch (error) {
      const errorMessage = `Ошибка загрузки аватара: ${error}`
      set({
        uploadError: errorMessage,
        isUploadingAvatar: false,
      })
      toast.error('Не удалось загрузить аватар')
      return false
    }
  },

  /**
   * Поиск пользователей по email или ID (админ)
   */
  searchUsers: async (query: string) => {
    set({ isSearching: true, error: null })

    try {
      const results = await api.users.searchUsers(query)
      set({
        searchResults: results,
        isSearching: false,
      })
    } catch (error) {
      set({
        error: `Ошибка поиска пользователей: ${error}`,
        searchResults: [],
        isSearching: false,
      })
    }
  },

  /**
   * Очистить результаты поиска
   */
  clearSearchResults: () => {
    set({ searchResults: [] })
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
    set({ error: null, uploadError: null })
  },

  /**
   * Сбросить состояние к начальному
   */
  reset: () => {
    set(initialState)
  },
}))

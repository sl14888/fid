import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { api } from '@/lib/api'
import type {
  UserDto,
  UserSearchResultDto,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from '@/types/user.types'

interface UsersPagination {
  currentPage: number
  totalPages: number
  totalElements: number
}

interface UsersState {
  currentUser: UserDto | null
  searchResults: UserSearchResultDto[]

  users: UserSearchResultDto[]
  pagination: UsersPagination | null
  isLoadingPage: boolean
  isLoadingMore: boolean
  isFetchedUsers: boolean

  isLoading: boolean
  isSearching: boolean
  isSendingVerification: boolean
  isUploadingAvatar: boolean
  adminIsUploadingAvatar: boolean
  adminIsUpdatingProfile: boolean
  adminIsTogglingBan: boolean
  error: string | null
  uploadError: string | null

  fetchUserById: (id: number) => Promise<void>
  updatePassword: (userId: number, data: UpdatePasswordRequest) => Promise<void>
  updateEmail: (userId: number, data: UpdateEmailRequest) => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  sendVerificationEmail: (email: string) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<boolean>
  loadUsers: (page: number, size: number) => Promise<void>
  loadMoreUsers: (page: number, size: number) => Promise<void>
  searchUsers: (query: string) => Promise<void>
  adminUploadUserAvatar: (userId: number, file: File) => Promise<boolean>
  adminUpdateUserProfile: (userId: number, data: UpdateProfileRequest) => Promise<void>
  adminToggleUserBan: (userId: number, ban: boolean) => Promise<void>
  clearSearchResults: () => void
  clearCurrentUser: () => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  currentUser: null,
  searchResults: [],
  users: [],
  pagination: null,
  isLoadingPage: false,
  isLoadingMore: false,
  isFetchedUsers: false,
  isLoading: false,
  isSearching: false,
  isSendingVerification: false,
  isUploadingAvatar: false,
  adminIsUploadingAvatar: false,
  adminIsUpdatingProfile: false,
  adminIsTogglingBan: false,
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
   * Обновить профиль пользователя (имя и email)
   */
  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isLoading: true, error: null })

    try {
      const updatedUser = await api.users.updateProfile(data)
      set({
        currentUser: updatedUser,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка обновления профиля: ${error}`,
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
      set({
        uploadError: `Ошибка загрузки аватара: ${error}`,
        isUploadingAvatar: false,
      })
      return false
    }
  },

  /**
   * Загрузить список пользователей с пагинацией (заменяет данные)
   */
  loadUsers: async (page: number, size: number) => {
    set({ isLoadingPage: true, error: null })

    try {
      const result = await api.users.getAllUsers({ page, size })
      set({
        users: result.content,
        pagination: {
          currentPage: result.pageable.pageNumber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoadingPage: false,
        isFetchedUsers: true,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки пользователей: ${error}`,
        isLoadingPage: false,
        isFetchedUsers: true,
      })
    }
  },

  /**
   * Загрузить ещё пользователей (аккумулирует данные)
   */
  loadMoreUsers: async (page: number, size: number) => {
    set({ isLoadingMore: true, error: null })

    try {
      const result = await api.users.getAllUsers({ page, size })
      set((state) => ({
        users: [...state.users, ...result.content],
        pagination: {
          currentPage: result.pageable.pageNumber,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoadingMore: false,
      }))
    } catch (error) {
      set({
        error: `Ошибка загрузки пользователей: ${error}`,
        isLoadingMore: false,
      })
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
   * Загрузить аватар пользователя (админ)
   */
  adminUploadUserAvatar: async (userId: number, file: File) => {
    set({ adminIsUploadingAvatar: true, uploadError: null })

    try {
      const updatedUser = await api.users.adminUpdateUserAvatar(userId, file)

      set((state) => ({
        currentUser: state.currentUser
          ? { ...state.currentUser, avatar: updatedUser.avatar }
          : null,
        adminIsUploadingAvatar: false,
      }))

      toast.success('Аватар успешно обновлен')
      return true
    } catch (error) {
      set({ uploadError: `Ошибка загрузки аватара: ${error}`, adminIsUploadingAvatar: false })
      return false
    }
  },

  /**
   * Обновить профиль пользователя (имя/email) через admin-эндпоинт
   */
  adminUpdateUserProfile: async (userId: number, data: UpdateProfileRequest) => {
    set({ adminIsUpdatingProfile: true, error: null })

    try {
      const updatedUser = await api.users.adminUpdateUserProfile(userId, data)
      set({ currentUser: updatedUser, adminIsUpdatingProfile: false })
    } catch (error) {
      set({ error: `Ошибка обновления профиля: ${error}`, adminIsUpdatingProfile: false })
      throw error
    }
  },

  /**
   * Обновить бан-статус пользователя (админ)
   */
  adminToggleUserBan: async (userId: number, ban: boolean) => {
    set({ adminIsTogglingBan: true, error: null })

    try {
      await api.users.adminToggleUserBan(userId, ban)
      set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, banned: ban } : null,
        adminIsTogglingBan: false,
      }))
    } catch (error) {
      set({ error: `Ошибка обновления статуса бана: ${error}`, adminIsTogglingBan: false })
      throw error
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

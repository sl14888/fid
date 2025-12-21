import { create } from 'zustand'
import { api } from '@/lib/api'
import type { FeedbackDto, FeedbackCreateDto } from '@/types/feedback.types'
import type { Page } from '@/types/api.types'
import type {
  FeedbackSortParams,
  UserFeedbacksParams,
  CompanyFeedbacksParams,
} from '@/types/request.types'

/**
 * Интерфейс состояния отзывов
 */
interface FeedbacksState {
  // Данные
  feedbacks: FeedbackDto[]
  currentFeedback: FeedbackDto | null

  // Пагинация
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
  } | null

  // Статусы загрузки
  isLoading: boolean
  isFetched: boolean
  error: string | null

  // Actions
  fetchFeedbackById: (id: number) => Promise<void>
  sortFeedbacks: (params: FeedbackSortParams) => Promise<void>
  loadMoreFeedbacks: (params: FeedbackSortParams) => Promise<void>
  fetchFeedbacksByUserEmail: (params: UserFeedbacksParams) => Promise<void>
  loadMoreUserFeedbacks: (params: UserFeedbacksParams) => Promise<void>
  fetchFeedbacksByCompanyId: (params: CompanyFeedbacksParams) => Promise<void>
  loadMoreCompanyFeedbacks: (params: CompanyFeedbacksParams) => Promise<void>
  createFeedback: (data: FeedbackCreateDto) => Promise<FeedbackDto | null>
  clearCurrentFeedback: () => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  feedbacks: [],
  currentFeedback: null,
  pagination: null,
  isLoading: false,
  isFetched: false,
  error: null,
}

export const useFeedbacksStore = create<FeedbacksState>((set) => ({
  ...initialState,

  /**
   * Получить отзыв по ID
   */
  fetchFeedbackById: async (id: number) => {
    set({ isLoading: true, error: null })

    try {
      const feedback = await api.feedbacks.getFeedbackById(id)
      set({
        currentFeedback: feedback,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки отзыва по ID: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Получить отсортированные отзывы
   */
  sortFeedbacks: async (params: FeedbackSortParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<FeedbackDto> =
        await api.feedbacks.sortFeedbacks(params)

      set({
        feedbacks: result.content,
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
        isFetched: true,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки отзывов: ${error}`,
        isLoading: false,
        isFetched: true,
      })
    }
  },

  /**
   * Загрузить больше отзывов (аккумуляция для Load More)
   */
  loadMoreFeedbacks: async (params: FeedbackSortParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<FeedbackDto> =
        await api.feedbacks.sortFeedbacks(params)

      set((state) => ({
        feedbacks: [...state.feedbacks, ...result.content],
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
        isFetched: true,
      }))
    } catch (error) {
      set({
        error: `Ошибка загрузки отзывов: ${error}`,
        isLoading: false,
        isFetched: true,
      })
    }
  },

  /**
   * Получить отзывы пользователя по email
   */
  fetchFeedbacksByUserEmail: async (params: UserFeedbacksParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<FeedbackDto> =
        await api.feedbacks.getFeedbacksByUserEmail(params)

      set({
        feedbacks: result.content,
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
        isFetched: true,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки отзывов пользователя`,
        isLoading: false,
        isFetched: true,
      })
    }
  },

  /**
   * Загрузить больше отзывов пользователя (аккумуляция для Load More)
   */
  loadMoreUserFeedbacks: async (params: UserFeedbacksParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<FeedbackDto> =
        await api.feedbacks.getFeedbacksByUserEmail(params)

      set((state) => ({
        feedbacks: [...state.feedbacks, ...result.content],
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: `Ошибка загрузки отзывов пользователя`,
        isLoading: false,
      })
    }
  },

  /**
   * Получить отзывы компании
   */
  fetchFeedbacksByCompanyId: async (params: CompanyFeedbacksParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<FeedbackDto> =
        await api.feedbacks.getFeedbacksByCompanyId(params)

      set({
        feedbacks: result.content,
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки отзывов компании: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Загрузить больше отзывов компании (аккумуляция для Load More)
   */
  loadMoreCompanyFeedbacks: async (params: CompanyFeedbacksParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<FeedbackDto> =
        await api.feedbacks.getFeedbacksByCompanyId(params)

      set((state) => ({
        feedbacks: [...state.feedbacks, ...result.content],
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: `Ошибка загрузки отзывов компании: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Создать новый отзыв
   */
  createFeedback: async (data: FeedbackCreateDto) => {
    set({ isLoading: true, error: null })

    try {
      const feedback = await api.feedbacks.createFeedback(data)
      set({ isLoading: false })
      return feedback
    } catch (error) {
      set({
        error: `Ошибка создания отзыва: ${error}`,
        isLoading: false,
      })
      return null
    }
  },

  /**
   * Очистить текущий отзыв
   */
  clearCurrentFeedback: () => {
    set({ currentFeedback: null })
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

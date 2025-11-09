import { create } from 'zustand'
import { api } from '@/lib/api'
import type { EmploymentTypeDto } from '@/types/company.types'

/**
 * Интерфейс состояния типов занятости
 */
interface EmploymentTypesState {
  // Данные
  employmentTypes: EmploymentTypeDto[]
  currentEmploymentType: EmploymentTypeDto | null

  // Статусы загрузки
  isLoading: boolean
  error: string | null

  // Actions
  fetchAllEmploymentTypes: () => Promise<void>
  fetchEmploymentTypeById: (id: number) => Promise<void>
  clearCurrentEmploymentType: () => void
  clearError: () => void
  reset: () => void
}

/**
 * Начальное состояние
 */
const initialState = {
  employmentTypes: [],
  currentEmploymentType: null,
  isLoading: false,
  error: null,
}

export const useEmploymentTypesStore = create<EmploymentTypesState>((set) => ({
  ...initialState,

  /**
   * Получить все типы занятости
   */
  fetchAllEmploymentTypes: async () => {
    set({ isLoading: true, error: null })

    try {
      const employmentTypes = await api.employmentTypes.getAllEmploymentTypes()
      set({
        employmentTypes,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки типов занятости: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Получить тип занятости по ID
   */
  fetchEmploymentTypeById: async (id: number) => {
    set({ isLoading: true, error: null })

    try {
      const employmentType = await api.employmentTypes.getEmploymentTypeById(id)
      set({
        currentEmploymentType: employmentType,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки типа занятости: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Очистить текущий тип занятости
   */
  clearCurrentEmploymentType: () => {
    set({ currentEmploymentType: null })
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

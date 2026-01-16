import { create } from 'zustand'
import { api } from '@/lib/api'

import type {
  CompanyWithCountFeedbacksDto,
  CompanyWithFeedbacksDto,
  CompanyCreateDto,
  CompanyUpdateDto,
} from '@/types/company.types'
import type { CompanySortParams } from '@/types/request.types'
import type { Page } from '@/types/api.types'

import type { CompanyEntity } from '@/lib/api/companies.api'

interface CompaniesState {
  companies: CompanyWithCountFeedbacksDto[] | CompanyEntity[]
  currentCompany: CompanyWithFeedbacksDto | null
  topCompanies: CompanyWithCountFeedbacksDto[]

  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
  } | null

  isLoading: boolean
  isFetched: boolean
  error: string | null

  fetchAllCompanies: () => Promise<void>
  fetchCompanyById: (id: number) => Promise<void>
  fetchTopCompanies: () => Promise<void>
  sortCompanies: (params: CompanySortParams) => Promise<void>
  loadMoreCompanies: (params: CompanySortParams) => Promise<void>
  searchCompanies: (query: string) => Promise<void>
  createCompany: (
    data: CompanyCreateDto
  ) => Promise<CompanyWithFeedbacksDto | null>
  updateCompany: (
    id: number,
    data: CompanyUpdateDto
  ) => Promise<CompanyWithFeedbacksDto | null>
  deleteCompany: (id: number) => Promise<boolean>
  clearCurrentCompany: () => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  companies: [],
  currentCompany: null,
  topCompanies: [],
  pagination: null,
  isLoading: false,
  isFetched: false,
  error: null,
}

export const useCompaniesStore = create<CompaniesState>((set) => ({
  ...initialState,

  /**
   * Получить все компании
   */
  fetchAllCompanies: async () => {
    set({ isLoading: true, error: null })

    try {
      const companies = await api.companies.getAllCompanies()
      set({
        companies,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки топ компаний: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Получить компанию по ID
   */
  fetchCompanyById: async (id: number) => {
    set({ isLoading: true, error: null })

    try {
      const company = await api.companies.getCompanyById(id)
      set({
        currentCompany: company,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки топ компаний: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Получить топ компаний
   */
  fetchTopCompanies: async () => {
    set({ isLoading: true, error: null })

    try {
      const topCompanies = await api.companies.getTopCompanies()
      set({
        topCompanies,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: `Ошибка загрузки топ компаний: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Сортировать компании с пагинацией
   */
  sortCompanies: async (params: CompanySortParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<CompanyWithCountFeedbacksDto> =
        await api.companies.sortCompanies(params)

      set({
        companies: result.content,
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
        error: `Ошибка сортировки компаний: ${error}`,
        isLoading: false,
        isFetched: true,
      })
    }
  },

  /**
   * Загрузить следующую страницу компаний (аккумуляция)
   * Используется для Load More
   */
  loadMoreCompanies: async (params: CompanySortParams) => {
    set({ isLoading: true, error: null })

    try {
      const result: Page<CompanyWithCountFeedbacksDto> =
        await api.companies.sortCompanies(params)

      set((state) => ({
        companies: [
          ...(state.companies as CompanyWithCountFeedbacksDto[]),
          ...result.content,
        ],
        pagination: {
          currentPage: result.number,
          totalPages: result.totalPages,
          totalElements: result.totalElements,
        },
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: `Ошибка загрузки компаний: ${error}`,
        isLoading: false,
      })
    }
  },

  /**
   * Поиск компаний
   */
  searchCompanies: async (query: string) => {
    set({ isLoading: true, error: null })

    try {
      const companies = await api.companies.searchCompanies({
        query,
      })
      set({
        companies,
        pagination: null,
        isLoading: false,
        isFetched: true,
      })
    } catch (error) {
      set({
        error: `Ошибка поиска компаний: ${error}`,
        isLoading: false,
        isFetched: true,
      })
    }
  },

  /**
   * Создать новую компанию
   */
  createCompany: async (data: CompanyCreateDto) => {
    set({ isLoading: true, error: null })

    try {
      const company = await api.companies.createCompany(data)
      set({ isLoading: false })
      return company
    } catch (error) {
      set({
        error: `Ошибка создания компании: ${error}`,
        isLoading: false,
      })
      return null
    }
  },

  /**
   * Обновить компанию
   */
  updateCompany: async (id: number, data: CompanyUpdateDto) => {
    set({ isLoading: true, error: null })

    try {
      const company = await api.companies.updateCompany(id, data)
      set({ isLoading: false, currentCompany: company })
      return company
    } catch (error) {
      set({
        error: `Ошибка обновления компании: ${error}`,
        isLoading: false,
      })
      return null
    }
  },

  /**
   * Удалить компанию
   */
  deleteCompany: async (id: number) => {
    set({ isLoading: true, error: null })

    try {
      await api.companies.deleteCompany(id)
      set({ isLoading: false, currentCompany: null })
      return true
    } catch (error) {
      set({
        error: `Ошибка удаления компании: ${error}`,
        isLoading: false,
      })
      return false
    }
  },

  /**
   * Очистить текущую компанию
   */
  clearCurrentCompany: () => {
    set({ currentCompany: null })
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

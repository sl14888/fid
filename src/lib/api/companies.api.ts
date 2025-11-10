import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  CompanyWithCountFeedbacksDto,
  CompanyWithFeedbacksDto,
  CompanyCreateDto,
  EmploymentTypeDto,
} from '@/types/company.types'
import type { Page } from '@/types/api.types'
import type {
  CompanySortParams,
  CompanySearchParams,
} from '@/types/request.types'

/**
 * Базовый тип для компании из списка всех компаний
 */
export interface CompanyEntity {
  id: number
  name: string
  address?: string | null
  employmentType: EmploymentTypeDto
  website?: string | null
  inn?: number | null
  banned: boolean
  createdTime?: string | null
}

/**
 * Получить список всех компаний без отзывов
 */
export const getAllCompanies = async (): Promise<CompanyEntity[]> => {
  const response = await axiosInstance.get<CompanyEntity[]>(
    API_ENDPOINTS.COMPANIES.ALL
  )
  return response.data
}

/**
 * Получить компанию с отзывами по ID
 */
export const getCompanyById = async (
  id: number
): Promise<CompanyWithFeedbacksDto> => {
  const response = await axiosInstance.get<CompanyWithFeedbacksDto>(
    API_ENDPOINTS.COMPANIES.BY_ID(id)
  )
  return response.data
}

/**
 * Получить топ 10 компаний по количеству отзывов
 */
export const getTopCompanies = async (): Promise<
  CompanyWithCountFeedbacksDto[]
> => {
  const response = await axiosInstance.get<CompanyWithCountFeedbacksDto[]>(
    API_ENDPOINTS.COMPANIES.TOP
  )
  return response.data
}

/**
 * Получить отсортированный список компаний с пагинацией
 */
export const sortCompanies = async (
  params: CompanySortParams
): Promise<Page<CompanyWithCountFeedbacksDto>> => {
  const response = await axiosInstance.get<Page<CompanyWithCountFeedbacksDto>>(
    API_ENDPOINTS.COMPANIES.SORT,
    {
      params: {
        page: params.page,
        size: params.size,
        param: params.sortOrder,
        type: params.sortType,
      },
    }
  )
  return response.data
}

/**
 * Поиск компаний по названию
 */
export const searchCompanies = async (
  params: CompanySearchParams
): Promise<CompanyWithCountFeedbacksDto[]> => {
  const response = await axiosInstance.get<CompanyWithCountFeedbacksDto[]>(
    API_ENDPOINTS.COMPANIES.SEARCH,
    {
      params: {
        name: params.query,
        employmentTypeId: params.employmentTypeId,
      },
    }
  )
  return response.data
}

/**
 * Создать новую компанию с первым отзывом
 */
export const createCompany = async (
  data: CompanyCreateDto
): Promise<CompanyWithFeedbacksDto> => {
  const response = await axiosInstance.post<CompanyWithFeedbacksDto>(
    API_ENDPOINTS.COMPANIES.BASE,
    data
  )
  return response.data
}

/**
 * Экспорт всех функций
 */
export const companiesApi = {
  getAllCompanies,
  getCompanyById,
  getTopCompanies,
  sortCompanies,
  searchCompanies,
  createCompany,
}

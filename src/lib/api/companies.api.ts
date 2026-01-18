import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  CompanyWithCountFeedbacksDto,
  CompanyWithFeedbacksDto,
  CompanyCreateDto,
  CompanyUpdateDto,
  EmploymentTypeDto,
} from '@/types/company.types'
import type { Page, ResponseDto } from '@/types/api.types'
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
  const response = await axiosInstance.get<ResponseDto<CompanyEntity[]>>(
    API_ENDPOINTS.COMPANIES.ALL
  )

  if (!response.data.data) {
    return []
  }

  return response.data.data
}

/**
 * Получить компанию с отзывами по ID
 */
export const getCompanyById = async (
  id: number
): Promise<CompanyWithFeedbacksDto> => {
  const response = await axiosInstance.get<
    ResponseDto<CompanyWithFeedbacksDto>
  >(API_ENDPOINTS.COMPANIES.BY_ID(id))

  if (!response.data.data) {
    throw new Error('Компания не найдена')
  }

  return response.data.data
}

/**
 * Получить топ 10 компаний по количеству отзывов
 */
export const getTopCompanies = async (): Promise<
  CompanyWithCountFeedbacksDto[]
> => {
  const response = await axiosInstance.get<
    ResponseDto<CompanyWithCountFeedbacksDto[]>
  >(API_ENDPOINTS.COMPANIES.TOP)

  if (!response.data.data) {
    return []
  }

  return response.data.data
}

/**
 * Получить отсортированный список компаний с пагинацией
 */
export const sortCompanies = async (
  params: CompanySortParams
): Promise<Page<CompanyWithCountFeedbacksDto>> => {
  const response = await axiosInstance.get<
    ResponseDto<Page<CompanyWithCountFeedbacksDto>>
  >(API_ENDPOINTS.COMPANIES.SORT, {
    params: {
      page: params.page,
      size: params.size,
      param: params.param,
      type: params.type,
    },
  })

  if (!response.data.data) {
    throw new Error('Компания не найдена')
  }

  return response.data.data
}

/**
 * Поиск компаний по названию
 */
export const searchCompanies = async (
  params: CompanySearchParams
): Promise<CompanyWithCountFeedbacksDto[]> => {
  const response = await axiosInstance.get<
    ResponseDto<Page<CompanyWithCountFeedbacksDto>>
  >(API_ENDPOINTS.COMPANIES.SEARCH, {
    params: {
      name: params.query,
      page: 0,
      size: 10,
    },
  })

  if (!response.data.data) {
    return []
  }

  return response.data.data.content
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
 * Обновить компанию (только для админа)
 */
export const updateCompany = async (
  id: number,
  data: CompanyUpdateDto
): Promise<CompanyWithFeedbacksDto> => {
  const response = await axiosInstance.put<
    ResponseDto<CompanyWithFeedbacksDto>
  >(API_ENDPOINTS.ADMIN.COMPANIES.UPDATE(id), data)

  if (!response.data.data) {
    throw new Error('Ошибка обновления компании')
  }

  return response.data.data
}

/**
 * Удалить компанию (только для админа)
 */
export const deleteCompany = async (id: number): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.ADMIN.COMPANIES.DELETE(id))
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
  updateCompany,
  deleteCompany,
}

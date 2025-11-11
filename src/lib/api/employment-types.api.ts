import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type { EmploymentTypeDto } from '@/types/company.types'
import type { ResponseDto } from '@/types/api.types'

/**
 * Получить список всех типов занятости
 */
export const getAllEmploymentTypes = async (): Promise<EmploymentTypeDto[]> => {
  const response = await axiosInstance.get<ResponseDto<EmploymentTypeDto[]>>(
    API_ENDPOINTS.EMPLOYMENT_TYPES.ALL
  )
  return response.data.data || []
}

/**
 * Получить тип занятости по ID
 */
export const getEmploymentTypeById = async (
  id: number
): Promise<EmploymentTypeDto> => {
  const response = await axiosInstance.get<ResponseDto<EmploymentTypeDto>>(
    API_ENDPOINTS.EMPLOYMENT_TYPES.BY_ID(id)
  )
  if (!response.data.data) {
    throw new Error('Employment type not found')
  }
  return response.data.data
}

/**
 * Экспорт всех функций
 */
export const employmentTypesApi = {
  getAllEmploymentTypes,
  getEmploymentTypeById,
}

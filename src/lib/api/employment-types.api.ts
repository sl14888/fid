import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type { EmploymentTypeDto } from '@/types/company.types'

/**
 * Получить список всех типов занятости
 */
export const getAllEmploymentTypes = async (): Promise<EmploymentTypeDto[]> => {
  const response = await axiosInstance.get<EmploymentTypeDto[]>(
    API_ENDPOINTS.EMPLOYMENT_TYPES.ALL
  )
  return response.data
}

/**
 * Получить тип занятости по ID
 */
export const getEmploymentTypeById = async (
  id: number
): Promise<EmploymentTypeDto> => {
  const response = await axiosInstance.get<EmploymentTypeDto>(
    API_ENDPOINTS.EMPLOYMENT_TYPES.BY_ID(id)
  )
  return response.data
}

/**
 * Экспорт всех функций
 */
export const employmentTypesApi = {
  getAllEmploymentTypes,
  getEmploymentTypeById,
}

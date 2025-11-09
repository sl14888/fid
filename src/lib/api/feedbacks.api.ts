import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type { FeedbackDto, FeedbackCreateDto } from '@/types/feedback.types'
import type { Page } from '@/types/api.types'
import type {
  FeedbackSortParams,
  UserFeedbacksParams,
  CompanyFeedbacksParams,
} from '@/types/request.types'

/**
 * Получить отзыв по ID
 */
export const getFeedbackById = async (id: number): Promise<FeedbackDto> => {
  const response = await axiosInstance.get<FeedbackDto>(
    API_ENDPOINTS.FEEDBACKS.BY_ID(id)
  )
  return response.data
}

/**
 * Получить отсортированный список отзывов с пагинацией
 */
export const sortFeedbacks = async (
  params: FeedbackSortParams
): Promise<Page<FeedbackDto>> => {
  const response = await axiosInstance.get<Page<FeedbackDto>>(
    API_ENDPOINTS.FEEDBACKS.SORT,
    {
      params: {
        sortType: params.sortType,
        sortOrder: params.sortOrder,
        page: params.page,
        size: params.size,
        companyId: params.companyId,
      },
    }
  )
  return response.data
}

/**
 * Получить список отзывов пользователя
 */
export const getFeedbacksByUserId = async (
  params: UserFeedbacksParams
): Promise<Page<FeedbackDto>> => {
  const response = await axiosInstance.get<Page<FeedbackDto>>(
    API_ENDPOINTS.FEEDBACKS.FIND_BY_USER,
    {
      params: {
        userId: params.userId,
        page: params.page,
        size: params.size,
      },
    }
  )
  return response.data
}

/**
 * Получить список отзывов компании
 */
export const getFeedbacksByCompanyId = async (
  params: CompanyFeedbacksParams
): Promise<Page<FeedbackDto>> => {
  const response = await axiosInstance.get<Page<FeedbackDto>>(
    API_ENDPOINTS.FEEDBACKS.FIND_BY_COMPANY,
    {
      params: {
        companyId: params.companyId,
        page: params.page,
        size: params.size,
      },
    }
  )
  return response.data
}

/**
 * Создать новый отзыв
 */
export const createFeedback = async (
  data: FeedbackCreateDto
): Promise<FeedbackDto> => {
  const response = await axiosInstance.post<FeedbackDto>(
    API_ENDPOINTS.FEEDBACKS.BASE,
    data
  )
  return response.data
}

/**
 * Экспорт всех функций
 */
export const feedbacksApi = {
  getFeedbackById,
  sortFeedbacks,
  getFeedbacksByUserId,
  getFeedbacksByCompanyId,
  createFeedback,
}

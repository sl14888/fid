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
  const response = await axiosInstance.get<{ data: FeedbackDto }>(
    API_ENDPOINTS.FEEDBACKS.BY_ID(id)
  )
  return response.data.data
}

/**
 * Получить отсортированный список отзывов с пагинацией
 */
export const sortFeedbacks = async (
  params: FeedbackSortParams
): Promise<Page<FeedbackDto>> => {
  const response = await axiosInstance.get<{ data: Page<FeedbackDto> }>(
    API_ENDPOINTS.FEEDBACKS.SORT,
    {
      params: {
        type: params.type,
        param: params.param,
        page: params.page,
        size: params.size,
        companyId: params.companyId,
      },
    }
  )
  return response.data.data
}

/**
 * Получить список отзывов пользователя по ID
 */
export const getFeedbacksByUserId = async (
  params: UserFeedbacksParams
): Promise<Page<FeedbackDto>> => {
  const response = await axiosInstance.get<{ data: Page<FeedbackDto> }>(
    API_ENDPOINTS.FEEDBACKS.FIND_BY_USER,
    {
      params: {
        page: params.page,
        size: params.size,
        userId: params.userId,
      },
    }
  )
  return response.data.data
}

/**
 * Получить список отзывов компании
 */
export const getFeedbacksByCompanyId = async (
  params: CompanyFeedbacksParams
): Promise<Page<FeedbackDto>> => {
  const response = await axiosInstance.get<{ data: Page<FeedbackDto> }>(
    API_ENDPOINTS.FEEDBACKS.FIND_BY_COMPANY,
    {
      params: {
        id: params.companyId,
        page: params.page,
        size: params.size,
      },
    }
  )
  return response.data.data
}

/**
 * Создать новый отзыв
 */
export const createFeedback = async (
  data: FeedbackCreateDto
): Promise<FeedbackDto> => {
  const response = await axiosInstance.post<{ data: FeedbackDto }>(
    API_ENDPOINTS.FEEDBACKS.BASE,
    data
  )
  return response.data.data
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

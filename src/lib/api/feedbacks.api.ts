import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  FeedbackDto,
  FeedbackCreateDto,
  FeedbackUpdateDto,
  FeedbackBetweenParams,
} from '@/types/feedback.types'
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
 * Обновить отзыв (только для админа)
 */
export const updateFeedback = async (
  id: number,
  data: FeedbackUpdateDto
): Promise<FeedbackDto> => {
  const response = await axiosInstance.put<{ data: FeedbackDto }>(
    API_ENDPOINTS.ADMIN.FEEDBACKS.UPDATE(id),
    data
  )
  return response.data.data
}

/**
 * Установить видимость отзыва (только для админа)
 */
export const setFeedbackVisibility = async (
  id: number,
  visible: boolean
): Promise<FeedbackDto> => {
  const response = await axiosInstance.put<{ data: FeedbackDto }>(
    API_ENDPOINTS.ADMIN.FEEDBACKS.SET_VIEW(id, visible)
  )
  return response.data.data
}

/**
 * Получить смежный отзыв (следующий или предыдущий)
 */
export const getFeedbackBetween = async (
  params: FeedbackBetweenParams
): Promise<FeedbackDto> => {
  const response = await axiosInstance.get<{ data: FeedbackDto }>(
    API_ENDPOINTS.FEEDBACKS.FIND_BETWEEN,
    {
      params: {
        id: params.id,
        next: params.next,
        prev: params.prev,
      },
    }
  )
  return response.data.data
}

/**
 * Экспорт всех функций
 */
export const feedbacksApi = {
  getFeedbackById,
  getFeedbackBetween,
  sortFeedbacks,
  getFeedbacksByUserId,
  getFeedbacksByCompanyId,
  createFeedback,
  updateFeedback,
  setFeedbackVisibility,
}

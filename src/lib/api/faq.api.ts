import { axiosPublicInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type { FaqItemDto, FaqListResponse } from '@/types/faq.types'

export const getAllFaqItems = async (): Promise<FaqItemDto[]> => {
  const response = await axiosPublicInstance.get<FaqListResponse>(
    API_ENDPOINTS.FAQ_DOCUMENT.ALL
  )
  return response.data.data
}

export const faqApi = { getAllFaqItems }

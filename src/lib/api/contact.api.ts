import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'

export interface SendContactMessageDto {
  contact: string
  message: string
}

export const sendContactMessage = async (
  data: SendContactMessageDto
): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.ADMIN.TELEGRAM.SEND, data)
}

export const contactApi = {
  sendContactMessage,
}

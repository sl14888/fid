import { axiosInstance } from './axios'
import { API_ENDPOINTS } from '@/constants/api'
import type { FileDto, FileUrlDto } from '@/types/file.types'

export const uploadPhotos = async (files: File[]): Promise<FileDto[]> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await axiosInstance.post<FileDto[]>(
    API_ENDPOINTS.PHOTOS.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const getPhotosByIds = async (ids: number[]): Promise<FileUrlDto[]> => {
  if (ids.length === 0) return []

  const response = await axiosInstance.get<FileUrlDto[]>(
    API_ENDPOINTS.PHOTOS.GET_BY_IDS(ids)
  )

  return response.data
}

export const deletePhoto = async (id: number): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.PHOTOS.DELETE(id))
}

export const photosApi = {
  uploadPhotos,
  getPhotosByIds,
  deletePhoto,
}

import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { photosApi } from '@/lib/api'
import type { UploadedPhoto, FileDto } from '@/types/file.types'

interface PhotosState {
  photos: UploadedPhoto[]
  isUploading: boolean
  isDeleting: boolean
  error: string | null

  uploadPhotos: (files: File[]) => Promise<FileDto[] | null>
  deletePhoto: (id: number) => Promise<boolean>
  setPhotos: (photos: UploadedPhoto[]) => void
  clearPhotos: () => void
  clearError: () => void
}

const initialState = {
  photos: [],
  isUploading: false,
  isDeleting: false,
  error: null,
}

export const usePhotosStore = create<PhotosState>((set) => ({
  ...initialState,

  uploadPhotos: async (files: File[]) => {
    set({ isUploading: true, error: null })

    try {
      const uploadedFiles = await photosApi.uploadPhotos(files)

      const newPhotos: UploadedPhoto[] = uploadedFiles.map((file) => ({
        id: file.id,
        url: file.url,
      }))

      set((state) => ({
        photos: [...state.photos, ...newPhotos],
        isUploading: false,
      }))

      toast.success('Фотографии успешно загружены')
      return uploadedFiles
    } catch (error) {
      const errorMessage = `Ошибка загрузки фотографий: ${error}`
      set({
        error: errorMessage,
        isUploading: false,
      })
      toast.error('Не удалось загрузить фотографии')
      return null
    }
  },

  deletePhoto: async (id: number) => {
    set({ isDeleting: true, error: null })

    try {
      await photosApi.deletePhoto(id)

      set((state) => ({
        photos: state.photos.filter((photo) => photo.id !== id),
        isDeleting: false,
      }))

      toast.success('Фотография удалена')
      return true
    } catch (error) {
      const errorMessage = `Ошибка удаления фотографии: ${error}`
      set({
        error: errorMessage,
        isDeleting: false,
      })
      toast.error('Не удалось удалить фотографию')
      return false
    }
  },

  setPhotos: (photos: UploadedPhoto[]) => {
    set({ photos })
  },

  clearPhotos: () => {
    set({ photos: [] })
  },

  clearError: () => {
    set({ error: null })
  },
}))

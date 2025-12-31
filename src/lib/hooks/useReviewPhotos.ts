import { useState, useEffect, useCallback } from 'react'
import { usePhotosStore } from '@/store/photos.store'
import { useSessionStorage } from './useSessionStorage'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'
import { validatePhotosList } from '@/lib/utils/file-validation'
import { showToast } from '@/lib/utils/toast-utils'
import { photosApi } from '@/lib/api'
import type { UploadedPhoto } from '@/types/file.types'

export const useReviewPhotos = () => {
  const { photos, isUploading, uploadPhotos, deletePhoto, setPhotos, clearPhotos } =
    usePhotosStore()

  const [photoIds, setPhotoIds, clearPhotoIds] = useSessionStorage<number[]>(
    SESSION_STORAGE_KEYS.REVIEW_PHOTOS,
    []
  )

  const [isRestoring, setIsRestoring] = useState(false)

  useEffect(() => {
    const restorePhotos = async () => {
      if (photoIds.length === 0) return

      setIsRestoring(true)
      try {
        const photoUrls = await photosApi.getPhotosByIds(photoIds)

        const restoredPhotos: UploadedPhoto[] = photoIds.map((id, index) => ({
          id,
          url: photoUrls[index]?.url || '',
        }))

        setPhotos(restoredPhotos.filter((photo) => photo.url !== ''))
      } catch (error: unknown) {
        console.error('Ошибка восстановления фотографий:', error)

        // При ошибке 403 (проблема авторизации на backend) или других ошибках
        // очищаем sessionStorage без показа toast, так как это временные файлы
        clearPhotoIds()
        clearPhotos()
      } finally {
        setIsRestoring(false)
      }
    }

    restorePhotos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const ids = photos.map((photo) => photo.id)
    setPhotoIds(ids)
  }, [photos, setPhotoIds])

  const handlePhotosUpload = useCallback(
    async (files: File[]) => {
      const validation = validatePhotosList(files, photos.length)

      if (!validation.valid) {
        showToast.error(validation.error || 'Ошибка валидации файлов')
        return
      }

      await uploadPhotos(files)
    },
    [photos.length, uploadPhotos]
  )

  const handlePhotoDelete = useCallback(
    async (id: number): Promise<void> => {
      await deletePhoto(id)
    },
    [deletePhoto]
  )

  const handleClearAll = useCallback(() => {
    clearPhotos()
    clearPhotoIds()
  }, [clearPhotos, clearPhotoIds])

  const getPhotoIds = useCallback((): number[] => {
    return photos.map((photo) => photo.id)
  }, [photos])

  return {
    photos,
    photoIds: getPhotoIds(),
    isUploading,
    isRestoring,
    handlePhotosUpload,
    handlePhotoDelete,
    handleClearAll,
  }
}

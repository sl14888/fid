import { useState, useEffect, useCallback, useRef } from 'react'
import { usePhotosStore } from '@/store/photos.store'
import { validatePhotosList } from '@/lib/utils/file-validation'
import { showToast } from '@/lib/utils/toast-utils'
import type { UploadedPhoto } from '@/types/file.types'
import type { FileDto } from '@/types/feedback.types'

export const useEditReviewPhotos = (initialPhotos: FileDto[] = []) => {
  const { photos, isUploading, uploadPhotos, deletePhoto, setPhotos, clearPhotos } =
    usePhotosStore()

  const [isRestoring, setIsRestoring] = useState(false)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    clearPhotos()

    if (initialPhotos.length > 0) {
      setIsRestoring(true)
      const photosFromFeedback: UploadedPhoto[] = initialPhotos.map((file) => ({
        id: file.id,
        url: file.url,
      }))
      setPhotos(photosFromFeedback)
      setIsRestoring(false)
    }

    return () => {
      clearPhotos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [clearPhotos])

  const getAllPhotoIds = useCallback((): number[] => {
    return photos.map((photo) => photo.id)
  }, [photos])

  return {
    photos,
    photoIds: getAllPhotoIds(),
    isUploading,
    isRestoring,
    handlePhotosUpload,
    handlePhotoDelete,
    handleClearAll,
  }
}

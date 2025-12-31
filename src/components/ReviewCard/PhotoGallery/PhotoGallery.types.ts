import type { FileDto } from '@/types/feedback.types'

export interface PhotoGalleryProps {
  /**
   * Массив фотографий для отображения
   */
  photos: FileDto[]

  /**
   * Обработчик клика по миниатюре
   * @param index - индекс фотографии в массиве
   */
  onPhotoClick?: (index: number) => void

  /**
   * Дополнительные CSS классы
   */
  className?: string
}

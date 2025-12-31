import type { FileDto } from '@/types/feedback.types'

export interface PhotoStackProps {
  /**
   * Массив фотографий для отображения
   */
  photos: FileDto[]

  /**
   * Максимальное количество видимых миниатюр
   * @default 4
   */
  maxVisible?: number

  /**
   * Дополнительные CSS классы
   */
  className?: string
}

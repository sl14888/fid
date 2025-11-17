import type { FeedbackDto } from '@/types/feedback.types'

/**
 * Пропсы компонента ReviewsList
 */
export interface ReviewsListProps {
  /**
   * Массив отзывов для отображения
   */
  reviews: FeedbackDto[]

  /**
   * Состояние загрузки первичных данных
   */
  isLoading?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Показывать скелетоны при загрузке
   */
  showSkeletons?: boolean

  /**
   * Количество скелетонов для отображения
   */
  skeletonsCount?: number
}

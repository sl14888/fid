import type { FeedbackDto } from '@/types/feedback.types'

/**
 * Пропсы компонента ReviewCard
 */
export interface ReviewCardProps {
  /**
   * Вариант отображения карточки:
   * - 'user' - показывает автора отзыва
   * - 'company' - показывает компанию
   */
  variant: 'user' | 'company'

  /**
   * Данные отзыва
   */
  feedback: FeedbackDto

  /**
   * Растянуть карточку на всю ширину
   */
  fluid?: boolean

  /**
   * Показать skeleton при загрузке
   */
  loading?: boolean

  /**
   * Дополнительные CSS классы
   */
  className?: string

  /**
   * Обработчик клика по кнопке "Читать полностью"
   */
  onReadMore?: () => void

  /**
   * Показывать полный текст без обрезки
   * @default false
   */
  fullReview?: boolean
}

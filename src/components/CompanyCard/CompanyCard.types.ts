import type { EmploymentTypeDto } from '@/types/company.types'

/**
 * Пропсы компонента карточки компании
 */
export interface CompanyCardProps {
  /**
   * Название компании
   */
  name: string

  /**
   * Тип занятости (тип компании)
   */
  employmentType: EmploymentTypeDto

  /**
   * ИНН компании (опционально)
   */
  inn?: number | null

  /**
   * Рейтинг компании
   */
  averageGrade: number

  /**
   * URL логотипа компании
   */
  logoUrl?: string | null

  /**
   * URL сайта компании
   */
  website?: string | null

  /**
   * Обработчик клика на кнопку "Оставить отзыв"
   */
  onReviewClick?: () => void

  /**
   * Дополнительный CSS класс
   */
  className?: string

  /**
   * Растянуть карточку на всю ширину
   * @default false
   */
  fluid?: boolean

  /**
   * Скрыть кнопку "Все отзывы"
   * @default false
   */
  hideAllReviewsButton?: boolean

  /**
   * Обработчик клика на кнопку "Все отзывы"
   * Если не передан, используется onReviewClick
   */
  onAllReviewsClick?: () => void
}

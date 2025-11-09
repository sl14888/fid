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
   * Описание компании
   */
  description?: string | null

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
}


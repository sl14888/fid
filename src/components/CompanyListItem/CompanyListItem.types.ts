/**
 * Пропсы компонента CompanyListItem
 */
export interface CompanyListItemProps {
  /**
   * URL логотипа компании
   */
  logoUrl?: string

  /**
   * Название компании
   */
  displayName?: string

  /**
   * Описание компании
   */
  description?: string

  /**
   * Средняя оценка компании
   */
  companyAverageGrade?: number

  /**
   * Количество оценок компании
   */
  companyCountFeedbacks?: number

  /**
   * Показать skeleton при загрузке
   */
  loading?: boolean

  /**
   * Растянуть карточку на всю ширину
   */
  fluid?: boolean

  /**
   * Обработчик клика по кнопке "Читать полностью"
   */
  onClick?: () => void
}

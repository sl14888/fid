export interface SmallCompanyCardProps {
  /**
   * Название компании
   */
  companyName?: string

  /**
   * Рейтинг компании от 0 до 5
   */
  rating?: number

  /**
   * URL логотипа компании
   */
  logoUrl?: string

  /**
   * Обработчик клика по карточке
   */
  onClick?: () => void

  /**
   * Режим загрузки (показывает скелетон)
   */
  loading?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

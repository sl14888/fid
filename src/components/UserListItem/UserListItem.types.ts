/**
 * Пропсы компонента UserListItem
 */
export interface UserListItemProps {
  /**
   * ID пользователя
   */
  id?: number | null

  /**
   * Имя пользователя
   */
  name?: string | null

  /**
   * Телефон пользователя
   */
  phone?: string | null

  /**
   * Email пользователя
   */
  email?: string | null

  /**
   * Количество отзывов пользователя
   */
  countFeedbacks?: number | null

  /**
   * URL аватара пользователя
   */
  avatarUrl?: string | null

  /**
   * Показать skeleton при загрузке
   */
  loading?: boolean

  /**
   * Растянуть карточку на всю ширину
   */
  fluid?: boolean

  /**
   * Обработчик клика по карточке
   */
  onClick?: () => void

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

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
   * Дополнительный CSS класс
   */
  className?: string
}

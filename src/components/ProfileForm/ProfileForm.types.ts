export interface ProfileFormProps {
  /**
   * Имя пользователя
   */
  name?: string

  /**
   * Email пользователя
   */
  email: string

  /**
   * Статус верификации email
   */
  isEmailVerified: boolean

  /**
   * Обработчик выхода из системы
   */
  onLogout: () => void

  /**
   * Обработчик сохранения профиля (имя и email)
   */
  onSaveProfile: (name: string, email: string) => Promise<boolean>

  /**
   * Состояние загрузки при сохранении
   */
  isSaving?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

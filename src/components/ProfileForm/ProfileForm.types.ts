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
   * Обработчик сохранения нового email
   */
  onSaveEmail: (newEmail: string) => Promise<boolean>

  /**
   * Состояние загрузки при сохранении
   */
  isSaving?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

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
   * Не требуется, если передан onBan (admin-режим)
   */
  onLogout?: () => void

  /**
   * Обработчик сохранения профиля (имя и email)
   */
  onSaveProfile: (name: string, email: string) => Promise<boolean>

  /**
   * Состояние загрузки при сохранении
   */
  isSaving?: boolean

  /**
   * Обработчик блокировки/разблокировки пользователя (только для admin-просмотра)
   * Если передан — кнопка «Выйти» скрыта, вместо неё показывается «Заблокировать»/«Разблокировать»
   */
  onBan?: () => Promise<void>

  /**
   * Состояние загрузки при бане/разбане
   */
  isBanning?: boolean

  /**
   * Текущий статус бана пользователя
   */
  isBanned?: boolean

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

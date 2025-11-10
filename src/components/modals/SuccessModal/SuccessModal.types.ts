export interface SuccessModalProps {
  /**
   * Открыта ли модалка
   */
  isOpen: boolean

  /**
   * Callback при закрытии модалки
   */
  onClose: () => void

  /**
   * Заголовок модалки
   */
  title?: string

  /**
   * Текст сообщения
   */
  message: string

  /**
   * Callback при клике на кнопку подтверждения
   */
  onConfirm?: () => void

  /**
   * Текст кнопки
   */
  confirmButtonText?: string

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

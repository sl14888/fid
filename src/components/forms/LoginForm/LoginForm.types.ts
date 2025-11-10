export interface LoginFormProps {
  /**
   * Callback при успешной авторизации
   */
  onSuccess?: () => void

  /**
   * Callback при клике на кнопку регистрации
   */
  onRegisterClick?: () => void

  /**
   * Callback при клике на "Забыли пароль?"
   */
  onForgotPasswordClick?: () => void

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

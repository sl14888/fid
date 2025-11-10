import type {
  LoginFormData,
  RegisterFormData,
} from '@/lib/validations/auth.schema'

/**
 * Дефолтные значения для формы логина
 */
export const LOGIN_FORM_DEFAULT_VALUES: LoginFormData = {
  email: '',
  password: '',
}

/**
 * Дефолтные значения для формы регистрации
 */
export const REGISTER_FORM_DEFAULT_VALUES: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

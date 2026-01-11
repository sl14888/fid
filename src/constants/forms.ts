import type {
  LoginFormData,
  RegisterFormData,
} from '@/lib/validations/auth.schema'
import type {
  CompanyFormData,
  ReviewFormData,
  AddReviewFormData,
} from '@/lib/validations/review.schema'
import type {
  ForgotPasswordEmailFormData,
  ForgotPasswordCodeFormData,
  ForgotPasswordNewPasswordFormData,
} from '@/lib/validations/forgotPassword.schema'

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

/**
 * Дефолтные значения для формы восстановления пароля (шаг 1: email)
 */
export const FORGOT_PASSWORD_EMAIL_DEFAULT_VALUES: ForgotPasswordEmailFormData =
  {
    email: '',
  }

/**
 * Дефолтные значения для формы восстановления пароля (шаг 2: код)
 */
export const FORGOT_PASSWORD_CODE_DEFAULT_VALUES: ForgotPasswordCodeFormData = {
  code: '',
}

/**
 * Дефолтные значения для формы восстановления пароля (шаг 3: новый пароль)
 */
export const FORGOT_PASSWORD_NEW_PASSWORD_DEFAULT_VALUES: ForgotPasswordNewPasswordFormData =
  {
    newPassword: '',
    confirmPassword: '',
  }

/**
 * Дефолтные значения для формы компании
 */
export const COMPANY_FORM_DEFAULT_VALUES: CompanyFormData = {
  name: '',
  employmentType: 0,
  website: '',
  inn: '',
  isExistingCompany: false,
}

/**
 * Дефолтные значения для формы отзыва
 */
export const REVIEW_FORM_DEFAULT_VALUES: ReviewFormData = {
  grade: 0,
  pluses: '',
  minuses: '',
  description: '',
  photoIds: [],
}

/**
 * Дефолтные значения для формы добавления отзыва
 */
export const ADD_REVIEW_FORM_DEFAULT_VALUES: AddReviewFormData = {
  company: COMPANY_FORM_DEFAULT_VALUES,
  review: REVIEW_FORM_DEFAULT_VALUES,
}

/**
 * Константы лимитов символов для полей формы отзыва
 */
export const REVIEW_FORM_LIMITS = {
  TEXT_FIELD_MAX_LENGTH: 3000,
  NAME_MAX_LENGTH: 255,
  WEBSITE_MAX_LENGTH: 255,
} as const

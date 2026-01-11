// Экспорт axios instance
export { axiosInstance } from './axios'

// Экспорт API клиентов
export * from './auth.api'
export * from './companies.api'
export * from './feedbacks.api'
export * from './employment-types.api'
export * from './users.api'
export * from './photos.api'
export * from './passwordReset.api'

// Реэкспорт для удобства
export { authApi } from './auth.api'
export { companiesApi } from './companies.api'
export { feedbacksApi } from './feedbacks.api'
export { employmentTypesApi } from './employment-types.api'
export { usersApi } from './users.api'
export { photosApi } from './photos.api'
export { passwordResetApi } from './passwordReset.api'

/**
 * Объект со всеми API клиентами для удобства
 */
import { authApi } from './auth.api'
import { companiesApi } from './companies.api'
import { feedbacksApi } from './feedbacks.api'
import { employmentTypesApi } from './employment-types.api'
import { usersApi } from './users.api'
import { photosApi } from './photos.api'
import { passwordResetApi } from './passwordReset.api'

export const api = {
  auth: authApi,
  companies: companiesApi,
  feedbacks: feedbacksApi,
  employmentTypes: employmentTypesApi,
  users: usersApi,
  photos: photosApi,
  passwordReset: passwordResetApi,
}

import type { Role } from './common.types'

/**
 * DTO пользователя
 */
export interface UserDto {
  id?: number
  name?: string
  mail?: string
  avatar?: string | null
  role?: Role
  banned?: boolean
  countFeedbacks?: number
}

/**
 * DTO результата поиска пользователя (для админа)
 */
export interface UserSearchResultDto {
  id: number
  name: string
  mail: string
  role: Role
  banned: boolean
  countFeedbacks: number
  avatar: string | null
}

/**
 * Запрос на авторизацию
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Запрос на регистрацию
 */
export interface RegistrationRequest {
  name: string
  email: string
  password: string
}

/**
 * Ответ при успешной аутентификации
 * Включает access и refresh токены
 */
export interface AuthenticationResponse {
  accessToken: string
  refreshToken: string
  email: string
  userRole: Role
  userId: number
}

/**
 * Ответ при обновлении токенов
 */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

/**
 * Запрос на обновление email
 */
export interface UpdateEmailRequest {
  newEmail: string
}

/**
 * Запрос на обновление профиля
 */
export interface UpdateProfileRequest {
  name: string
  mail: string
}

/**
 * Запрос на обновление пароля
 */
export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * Запрос на отправку кода восстановления пароля
 */
export interface SendPasswordResetCodeRequest {
  email: string
}

/**
 * Запрос на сброс пароля с кодом
 */
export interface ResetPasswordRequest {
  email: string
  verificationCode: number
  newPassword: string
  currentPassword: string
}

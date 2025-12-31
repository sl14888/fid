import type { Role } from './common.types'

/**
 * DTO пользователя
 */
export interface UserDto {
  id?: number | null
  name?: string | null
  mail?: string | null
  avatar?: string | null
  role?: Role | null
  banned?: boolean | null
  countFeedbacks?: number | null
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
 * Запрос на обновление пароля
 */
export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

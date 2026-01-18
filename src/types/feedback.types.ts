/**
 * DTO отзыва
 */
export interface FeedbackDto {
  id?: number | null
  title?: string | null
  pluses?: string | null
  minuses?: string | null
  description?: string | null
  companyId?: number | null
  companyAvatar?: string | null
  companyName?: string | null
  companyAverageGrade?: number | null
  companyCountFeedbacks?: number | null
  userEmail?: string | null
  userName?: string | null
  userAvatar?: string | null
  onView?: boolean | null
  grade?: number | null
  createdTime?: string | null // ISO 8601 формат
  files?: FileDto[] | null
  hasNext?: boolean | null
  hasPrev?: boolean | null
}

/**
 * DTO файла (фотографии)
 */
export interface FileDto {
  id: number
  url: string
}

/**
 * Запрос на создание отзыва
 */
export interface FeedbackCreateDto {
  pluses?: string | null
  minuses?: string | null
  description: string
  companyId: number
  userEmail: string
  grade: number
  files?: number[]
}

/**
 * Запрос на обновление отзыва (админ)
 */
export interface FeedbackUpdateDto {
  pluses?: string | null
  minuses?: string | null
  description?: string | null
  grade?: number | null
  createdTime?: string | null
  userEmail?: string | null
  files?: number[]
}

/**
 * Параметры запроса для получения смежного отзыва
 */
export interface FeedbackBetweenParams {
  id: number
  next?: boolean
  prev?: boolean
}

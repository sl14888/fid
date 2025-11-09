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
  companyName?: string | null
  companyAverageGrade?: number | null
  companyCountFeedbacks?: number | null
  userEmail?: string | null
  userName?: string | null
  onView?: boolean | null
  grade?: number | null
  createdTime?: string | null // ISO 8601 формат
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
}

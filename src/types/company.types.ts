import type { FeedbackDto } from './feedback.types'

/**
 * Тип занятости
 */
export interface EmploymentTypeDto {
  id?: number | null
  description?: string | null
}

/**
 * DTO компании с количеством отзывов
 */
export interface CompanyWithCountFeedbacksDto {
  id: number
  name: string
  employmentType: EmploymentTypeDto
  website?: string | null
  inn?: number | null
  averageGrade: number
  countFeedbacks: number
  avatar?: AvatarTypeDto
}

/**
 * DTO компании с отзывами
 */
export interface CompanyWithFeedbacksDto {
  id: number
  name: string
  banned: boolean
  address?: string | null
  employmentType: EmploymentTypeDto
  website?: string | null
  inn?: number | null
  averageGrade: number
  feedbacks?: FeedbackDto[] | null
  countFeedbacks?: number | null
  avatar?: AvatarTypeDto
}

/**
 * Запрос на создание компании
 */
export interface CompanyCreateDto {
  name: string
  address?: string | null
  employmentType: number
  website?: string | null
  inn?: number | null
  avatarFileId?: number | null
  feedback: {
    pluses?: string | null
    minuses?: string | null
    description: string
    userEmail: string
    grade: number
    files?: number[]
  }
}

/**
 * Запрос на обновление компании (админ)
 */
export interface CompanyUpdateDto {
  name: string
  address?: string | null
  employmentType: number
  website?: string | null
  inn?: number | null
  createdTime?: string | null
}

/**
 * DTO аватара
 */
export interface AvatarTypeDto {
  id?: number | null
  url?: string | null
}

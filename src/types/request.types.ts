/**
 * Типы для параметров API запросов
 */

/**
 * Типы сортировки из бэкенда
 */
export enum SortType {
  RATING = 'RATING',
  TIME = 'TIME',
  POPULAR = 'POPULAR',
}

/**
 * Порядок сортировки
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Параметры сортировки
 */
export interface SortParams {
  type: SortType
  param?: SortOrder
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number
  size: number
}

/**
 * Параметры сортировки компаний
 */
export interface CompanySortParams
  extends SortParams,
    Partial<PaginationParams> {
  employmentTypeId?: number
}

/**
 * Параметры поиска компаний
 */
export interface CompanySearchParams {
  query: string
}

/**
 * Параметры сортировки отзывов
 */
export interface FeedbackSortParams
  extends SortParams,
    Partial<PaginationParams> {
  companyId?: number
}

/**
 * Параметры получения отзывов пользователя
 */
export interface UserFeedbacksParams extends Partial<PaginationParams> {
  userId: number
}

/**
 * Параметры получения отзывов компании
 */
export interface CompanyFeedbacksParams extends Partial<PaginationParams> {
  companyId: number
}

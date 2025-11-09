/**
 * Стандартная обертка для всех ответов API
 */
export interface ResponseDto<T> {
  data: T | null
  success: boolean
  message: string | null
}

/**
 * Информация о пагинации
 */
export interface Page<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  numberOfElements: number
  first: boolean
  empty: boolean
}

/**
 * Роли пользователей в системе
 */
export enum Role {
  ADMIN = 'ADMIN',
  RAW_USER = 'RAW_USER',
  VERIFIED_USER = 'VERIFIED_USER',
}

/**
 * Направление сортировки
 */
export enum SortParam {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Тип сортировки
 */
export enum SortType {
  TIME = 'TIME',
  RATING = 'RATING',
  POPULAR = 'POPULAR',
}

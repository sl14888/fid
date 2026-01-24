// Базовый URL для API
// В development используем прокси Next.js API Route (см. src/app/api/[...path]/route.ts)
// Запросы идут на /api/* и проксируются на бэкенд для обхода CORS
// В production используем переменную окружения NEXT_PUBLIC_API_URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * HTTP статусы
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UPGRADE_REQUIRED = 426,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/registration',
    REFRESH: '/api/v1/auth/refresh',
  },
  COMPANIES: {
    BASE: '/api/v1/companies',
    ALL: '/api/v1/companies/all',
    TOP: '/api/v1/companies/top',
    SORT: '/api/v1/companies/sort',
    SEARCH: '/api/v1/companies/search',
    BY_ID: (id: number) => `/api/v1/companies/${id}`,
  },
  FEEDBACKS: {
    BASE: '/api/v1/feedbacks',
    SORT: '/api/v1/feedbacks/sort',
    FIND_BY_USER: '/api/v1/feedbacks/find',
    FIND_BY_COMPANY: '/api/v1/feedbacks/find/company',
    FIND_BETWEEN: '/api/v1/feedbacks/find/between',
    BY_ID: (id: number) => `/api/v1/feedbacks/${id}`,
  },
  EMPLOYMENT_TYPES: {
    ALL: '/api/v1/employment-type/all',
    BY_ID: (id: number) => `/api/v1/employment-type/${id}`,
  },
  USERS: {
    BY_ID: (id: number) => `/api/v1/users/${id}`,
    BY_EMAIL: (email: string) => `/api/v1/users/email/${email}`,
    UPDATE_PASSWORD: (userId: number) => `/api/v1/users/${userId}/password`,
    UPDATE_EMAIL: (userId: number) => `/api/v1/users/${userId}/email`,
    UPDATE_AVATAR: () => `/api/v1/users/avatar`,
    SEARCH: (query: string) => `/api/v1/admin/user/find/${encodeURIComponent(query)}`,
    ALL: '/api/v1/admin/user/find/all',
  },
  VERIFY: {
    BASE: '/api/v1/verify',
    TOKEN_SEND: '/api/v1/verify/token/send',
  },
  PHOTOS: {
    UPLOAD: '/api/v1/photos/upload',
    GET_BY_IDS: (ids: number[]) => `/api/v1/photos/files/${ids.join(',')}`,
    DELETE: (id: number) => `/api/v1/photos/${id}`,
  },
  PASSWORD_RESET: {
    SEND_CODE: '/api/v1/verify/code/send',
    RESET: '/api/v1/users/password',
  },
  ADMIN: {
    FEEDBACKS: {
      UPDATE: (id: number) => `/api/v1/admin/feedbacks/${id}`,
      SET_VIEW: (id: number, visible: boolean) =>
        `/api/v1/admin/feedbacks/view/${id}/${visible}`,
    },
    COMPANIES: {
      UPDATE: (id: number) => `/api/v1/admin/companies/${id}`,
      DELETE: (id: number) => `/api/v1/admin/companies/${id}`,
    },
  },
} as const

/**
 * Дефолтные параметры пагинации
 */
export const DEFAULT_PAGINATION = {
  PAGE: 0,
  SIZE: 10,
} as const

/**
 * Сообщения об ошибках
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка подключения к серверу',
  UNAUTHORIZED: 'Необходима авторизация',
  FORBIDDEN: 'Доступ запрещен',
  NOT_FOUND: 'Ресурс не найден',
  CONFLICT: 'Пользователь с таким email уже существует',
  BAD_REQUEST: 'Неверные данные. Проверьте введенную информацию',
  SERVER_ERROR: 'Внутренняя ошибка сервера',
  SESSION_EXPIRED: 'Сессия истекла. Пожалуйста, войдите снова',
  INTERNAL_SERVER_ERROR: 'Ошибка сервера. Попробуйте позже',
  DEFAULT: 'Произошла ошибка при выполнении запроса',
} as const

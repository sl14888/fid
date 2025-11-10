// В development используем API Route прокси (см. src/app/api/[...path]/route.ts)
// Все запросы идут на /api/* и проксируются на http://localhost:8080/api/*
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
  },
  COMPANIES: {
    BASE: '/api/v1/companies/', // Слеш в конце обязателен для POST
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
  },
  VERIFY: {
    BASE: '/api/v1/verify',
    RESEND: (userId: number) => `/api/v1/verify/${userId}/resend`,
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
 * Ключи для localStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
} as const

/**
 * Сообщения об ошибках
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка подключения к серверу',
  UNAUTHORIZED: 'Необходима авторизация',
  FORBIDDEN: 'Доступ запрещен',
  NOT_FOUND: 'Ресурс не найден',
  SERVER_ERROR: 'Внутренняя ошибка сервера',
  TOKEN_EXPIRED: 'Сессия истекла. Пожалуйста, войдите снова',
  DEFAULT: 'Произошла ошибка при выполнении запроса',
} as const

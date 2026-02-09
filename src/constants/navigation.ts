import { IconName } from '@/components/ui/Icon'

export interface NavigationLink {
  href: string
  label: string
  icon?: (typeof IconName)[keyof typeof IconName]
}

// Базовые навигационные ссылки
export const NAV_LINKS = {
  HOME: {
    href: '/',
    label: 'Главная',
    icon: IconName.House,
  },
  COMPANIES: {
    href: '/companies',
    label: 'Компании',
    icon: IconName.List,
  },
  REVIEWS: {
    href: '/reviews/new',
    label: 'Отзыв',
    icon: IconName.Plus,
  },
  PROFILE: {
    href: '/profile',
    label: 'Профиль',
    icon: IconName.Person,
  },
  ABOUT: {
    href: '/about-service',
    label: 'О компании',
  },
  ALL_COMPANIES: {
    href: '/companies',
    label: 'Все компании',
  },
  FOR_BUSINESS: {
    href: '/for-business',
    label: 'Fid для бизнеса',
  },
  PRIVACY_POLICY: {
    href: '/privacy',
    label: 'Политика конфиденциальности',
  },
  USER_AGREEMENT: {
    href: '/about-service',
    label: 'Пользовательское соглашение',
  },
  SERVICE_RULES: {
    href: '/terms',
    label: 'Правила сервиса',
  },
  SITEMAP: {
    href: '/sitemap',
    label: 'Карта сайта',
  },
  REGISTER: {
    href: '/register',
    label: 'Регистрация',
  },
  LOGIN: {
    href: '/login',
    label: 'Вход',
  },
  NEW_REVIEW: {
    href: '/reviews/new',
    label: 'Добавить отзыв',
  },
  NEW_COMPANY: {
    href: '/companies/new',
    label: 'Добавить компанию',
  },
  ADMIN: {
    href: '/admin',
    label: 'Админка',
    icon: IconName.PersonOutline,
  },
  ADMIN_REVIEWS: {
    href: '/reviews',
    label: 'Новые отзывы',
  },
  ADMIN_USERS: {
    href: '/users',
    label: 'Пользователи',
  },
} as const

// Конфигурация навигации для админ-панели dropdown
export const ADMIN_DROPDOWN_OPTIONS: NavigationLink[] = [
  NAV_LINKS.ADMIN_USERS,
  NAV_LINKS.ADMIN_REVIEWS,
]

// Конфигурация навигации для TopBar (мобильная навигация)
export const TOPBAR_LINKS: NavigationLink[] = [
  NAV_LINKS.HOME,
  NAV_LINKS.COMPANIES,
  NAV_LINKS.REVIEWS,
  NAV_LINKS.PROFILE,
]

// Конфигурация навигации для Footer
export const FOOTER_NAV_LINKS: NavigationLink[] = [
  NAV_LINKS.COMPANIES,
  NAV_LINKS.REVIEWS,
  NAV_LINKS.PROFILE,
  NAV_LINKS.ABOUT,
]

// Конфигурация навигации для Header
export const HEADER_NAV_LINKS: NavigationLink[] = [
  NAV_LINKS.ALL_COMPANIES,
  NAV_LINKS.FOR_BUSINESS,
]

// Конфигурация информационных ссылок для Footer
export const FOOTER_NAV_LINKS_INFO: NavigationLink[] = [
  NAV_LINKS.PRIVACY_POLICY,
  NAV_LINKS.USER_AGREEMENT,
  NAV_LINKS.SERVICE_RULES,
  NAV_LINKS.SITEMAP,
]

/**
 * Защищенные роуты, требующие авторизации
 */
export const PROTECTED_ROUTES = [
  NAV_LINKS.PROFILE.href,
  NAV_LINKS.NEW_COMPANY.href,
  NAV_LINKS.ADMIN.href,
  '/reviews',
  '/users',
] as const

/**
 * Публичные роуты (не требуют авторизации)
 */
export const PUBLIC_ROUTES = [
  NAV_LINKS.HOME.href,
  NAV_LINKS.COMPANIES.href,
  NAV_LINKS.REVIEWS.href,
  NAV_LINKS.REGISTER.href,
  NAV_LINKS.ABOUT.href,
] as const

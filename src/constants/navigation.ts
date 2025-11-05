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
    href: '/reviews',
    label: 'Отзывы',
    icon: IconName.Review,
  },
  PROFILE: {
    href: '/profile',
    label: 'Профиль',
    icon: IconName.Person,
  },
  ABOUT: {
    href: '/about',
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
    href: '/privacy-policy',
    label: 'Политика конфиденциальности',
  },
  USER_AGREEMENT: {
    href: '/user-agreement',
    label: 'Пользовательское соглашение',
  },
  SERVICE_RULES: {
    href: '/service-rules',
    label: 'Правила сервиса',
  },
  SITEMAP: {
    href: '/sitemap',
    label: 'Карта сайта',
  },
} as const

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

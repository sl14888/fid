import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PROTECTED_ROUTES } from '@/constants/navigation'

function isProtectedReviewsRoute(pathname: string): boolean {
  if (pathname === '/reviews') {
    return true
  }

  // /reviews/[id]/edit - редактирование отзыва (админ)
  if (/^\/reviews\/[^/]+\/edit$/.test(pathname)) {
    return true
  }

  return false
}

/**
 * Middleware для защиты роутов
 * Проверяет наличие refresh_token в HttpOnly cookie
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Получаем refresh_token из cookies (устанавливается бэкендом)
  const refreshToken =
    request.cookies.get('refresh_token')?.value ||
    request.cookies.get('access_token')?.value

  if (pathname.startsWith('/reviews')) {
    const isProtected = isProtectedReviewsRoute(pathname)
    if (isProtected && !refreshToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('auth', 'required')
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const isProtectedRoute = PROTECTED_ROUTES.filter(
    (route) => route !== '/reviews'
  ).some((route) => pathname.startsWith(route))

  // Если роут защищен и токенов нет - редирект на главную
  if (isProtectedRoute && !refreshToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('auth', 'required')
    return NextResponse.redirect(url)
  }

  // Admin роуты требуют дополнительной проверки роли
  // Это будет обработано на клиенте или через API
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Здесь можно добавить проверку роли из JWT токена
    // Для этого нужно будет декодировать токен на сервере
    // Пока оставляем простую проверку наличия токена
  }

  return NextResponse.next()
}

/**
 * Конфигурация middleware
 * Указываем, для каких путей применять middleware
 */
export const config = {
  matcher: [
    /*
     * Применяем middleware для всех роутов кроме:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|register).*)',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PROTECTED_ROUTES } from '@/constants/navigation'

/**
 * Middleware для защиты роутов
 * Проверяет наличие refresh_token в HttpOnly cookie
 */
export function middleware(request: NextRequest) {
  // Получаем refresh_token из cookies (устанавливается бэкендом)
  // Имя куки: refresh_token (подтверждено бэкендером)
  const refreshToken =
    request.cookies.get('refresh_token')?.value ||
    request.cookies.get('access_token')?.value

  // Проверяем, является ли текущий путь защищенным
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

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

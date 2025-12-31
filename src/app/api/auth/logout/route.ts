import { NextResponse } from 'next/server'

/**
 * Logout endpoint - очищает HttpOnly куки
 * Бэкенд не имеет logout endpoint, поэтому очищаем куки на Next.js сервере
 */
export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )

  // Удаляем access_token cookie
  response.cookies.set('access_token', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  })

  // Удаляем refresh_token cookie
  response.cookies.set('refresh_token', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}

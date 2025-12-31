import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://217.12.40.3:8080'

/**
 * Прокси для всех API запросов к бэкенду
 * Обходит CORS, т.к. запросы идут с сервера Next.js, а не из браузера
 */
async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Ждем params (они асинхронные в Next.js 15)
    const { path: pathArray } = await context.params
    const path = pathArray.join('/')

    // Добавляем query параметры если есть
    const searchParams = request.nextUrl.searchParams.toString()
    const queryString = searchParams ? `?${searchParams}` : ''
    const url = `${BACKEND_URL}/api/${path}${queryString}`

    // Определяем Content-Type входящего запроса
    const contentType = request.headers.get('content-type') || ''
    const isMultipart = contentType.includes('multipart/form-data')

    // Получаем тело запроса если есть
    let body: BodyInit | undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (isMultipart) {
        // Для multipart/form-data читаем как FormData
        body = await request.formData()
      } else {
        // Для остальных запросов читаем как текст
        body = await request.text()
      }
    }

    // Копируем только необходимые заголовки
    const headers: HeadersInit = {}

    // Для multipart/form-data НЕ устанавливаем Content-Type
    // (браузер добавит его автоматически с boundary)
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json'
    }

    headers['Accept'] = 'application/json'

    // ВАЖНО: Пробрасываем куки от клиента к бэкенду
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    // Делаем запрос к бэкенду
    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    })

    const data = await response.text()

    // Создаем ответ с данными
    const nextResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/json',
      },
    })

    // ВАЖНО: Копируем Set-Cookie заголовки от бэкенда (если есть)
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })

    // Устанавливаем куки из токенов в JSON response
    // Бэкенд возвращает токены в JSON, устанавливаем их как HttpOnly куки
    if (
      path.includes('auth/login') ||
      path.includes('auth/registration') ||
      path.includes('auth/refresh')
    ) {
      try {
        const jsonData = JSON.parse(data)
        const tokens = jsonData.data

        // Secure только для production (HTTPS), в dev используем HTTP
        const isProduction = process.env.NODE_ENV === 'production'
        const secureFlag = isProduction ? ' Secure;' : ''

        if (tokens?.accessToken) {
          // Бэкенд возвращает токены с "Bearer " префиксом в JSON
          // Убираем префикс - в куке храним чистый токен
          const accessToken = tokens.accessToken.replace(/^Bearer\s+/i, '')
          // Устанавливаем access_token cookie (1 день)
          nextResponse.headers.append(
            'Set-Cookie',
            `access_token=${accessToken}; Path=/; HttpOnly;${secureFlag} SameSite=Lax; Max-Age=${60 * 60 * 24}`
          )
        }

        if (tokens?.refreshToken) {
          // Убираем "Bearer " префикс если он есть
          const refreshToken = tokens.refreshToken.replace(/^Bearer\s+/i, '')
          // Устанавливаем refresh_token cookie (7 дней)
          nextResponse.headers.append(
            'Set-Cookie',
            `refresh_token=${refreshToken}; Path=/; HttpOnly;${secureFlag} SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
          )
        }
      } catch (e) {
        // Если не JSON или нет токенов - ничего не делаем
      }
    }

    return nextResponse
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      {
        error: 'Ошибка прокси сервера',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8080'

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

    // Получаем тело запроса если есть
    let body: string | undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text()
    }

    // Копируем только необходимые заголовки
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    // Добавляем Authorization если есть
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Делаем запрос к бэкенду
    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    })

    // Получаем тело ответа
    const data = await response.text()

    // Возвращаем ответ с теми же статусом и заголовками
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type':
          response.headers.get('Content-Type') || 'application/json',
      },
    })
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

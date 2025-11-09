import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

/**
 * Форматирует дату в читаемый формат
 * @param dateString - строка даты в формате ISO 8601
 * @param formatString - формат вывода (по умолчанию "d MMMM yyyy")
 * @returns отформатированная строка даты или пустая строка при ошибке
 *
 * @example
 * formatDate('2024-01-15T10:30:00.000Z') // "15 января 2024"
 * formatDate('2024-01-15T10:30:00.000Z', 'dd.MM.yyyy') // "15.01.2024"
 */
export const formatDate = (
  dateString?: string | null,
  formatString: string = 'd MMMM yyyy'
): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return ''
    }

    return format(date, formatString, { locale: ru })
  } catch {
    return ''
  }
}

/**
 * Форматирует дату в относительный формат (сегодня, вчера, N дней назад)
 * @param dateString - строка даты в формате ISO 8601
 * @returns относительная дата или пустая строка при ошибке
 *
 * @example
 * formatRelativeDate('2024-01-15T10:30:00.000Z') // "15 января 2024" или "2 дня назад"
 */
export const formatRelativeDate = (dateString?: string | null): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дня назад`

    return formatDate(dateString)
  } catch {
    return ''
  }
}

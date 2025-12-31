import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatDate = (
  dateString?: string | null,
  formatString: string = 'd MMMM yyyy'
): string => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return ''
    }

    return format(date, formatString, { locale: ru })
  } catch {
    return ''
  }
}

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

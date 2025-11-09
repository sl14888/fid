/**
 * Получает инициалы из полного имени
 * @param name - полное имя (например, "Иван Петров")
 * @returns инициалы (например, "ИП") или "?" если имя пустое
 *
 * @example
 * getInitials('Иван Петров') // "ИП"
 * getInitials('Анна') // "АН"
 * getInitials('') // "?"
 */
export const getInitials = (name?: string | null): string => {
  if (!name) return '?'

  const trimmed = name.trim()
  if (!trimmed) return '?'

  const words = trimmed.split(/\s+/)

  // Если несколько слов - берем первые буквы первых двух слов
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  // Если одно слово - берем первые две буквы
  return trimmed.substring(0, 2).toUpperCase()
}

/**
 * Обрезает текст до указанной длины и добавляет троеточие
 * @param text - исходный текст
 * @param maxLength - максимальная длина
 * @returns обрезанный текст с троеточием
 *
 * @example
 * truncateText('Очень длинный текст', 10) // "Очень длин..."
 */
export const truncateText = (
  text: string,
  maxLength: number = 100
): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Капитализирует первую букву строки
 * @param text - исходный текст
 * @returns текст с заглавной первой буквой
 *
 * @example
 * capitalize('привет') // "Привет"
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

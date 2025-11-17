/**
 * Типы элементов пагинации
 */
export type PaginationElement =
  | { type: 'page'; displayValue: number; zeroBasedIndex: number }
  | { type: 'ellipsis' }

/**
 * Генерирует массив элементов для отображения в пагинации
 * с учетом текущей страницы и общего количества страниц
 *
 * Логика отображения:
 * - Если страниц <= 5: показываем все страницы
 * - Если текущая страница в начале (0-3): [1 2 3 4 ... последняя]
 * - Если текущая страница в конце (totalPages-4 до totalPages-1): [1 ... (total-3) (total-2) (total-1) total]
 * - Если текущая страница в середине: [1 ... (current-1) current (current+1) ... последняя]
 *
 * @param currentPage - Текущая активная страница (0-based индексация)
 * @param totalPages - Общее количество страниц
 * @param maxVisiblePages - Максимальное количество видимых страниц в одной зоне (по умолчанию 4)
 * @returns Массив элементов для отображения
 *
 * @example
 * // Для 10 страниц, текущая страница 5 (индекс 4)
 * generatePaginationElements(4, 10)
 * // Вернет: [1, ..., 4, 5, 6, ..., 10]
 */
export const generatePaginationElements = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 4
): PaginationElement[] => {
  const elements: PaginationElement[] = []

  // Если страниц <= 5, показываем все страницы без многоточий
  if (totalPages <= 5) {
    for (let i = 0; i < totalPages; i++) {
      elements.push({
        type: 'page',
        displayValue: i + 1,
        zeroBasedIndex: i,
      })
    }
    return elements
  }

  // Определяем зоны: начало (0-3), конец (totalPages-4 до totalPages-1), середина (остальное)
  const isInStartZone = currentPage <= 3
  const isInEndZone = currentPage >= totalPages - 4

  if (isInStartZone) {
    // Начальная зона: показываем 1 2 3 4 ... последняя
    for (let i = 0; i < maxVisiblePages; i++) {
      elements.push({
        type: 'page',
        displayValue: i + 1,
        zeroBasedIndex: i,
      })
    }

    elements.push({ type: 'ellipsis' })

    elements.push({
      type: 'page',
      displayValue: totalPages,
      zeroBasedIndex: totalPages - 1,
    })
  } else if (isInEndZone) {
    // Конечная зона: показываем 1 ... (total-3) (total-2) (total-1) total
    elements.push({
      type: 'page',
      displayValue: 1,
      zeroBasedIndex: 0,
    })

    elements.push({ type: 'ellipsis' })

    for (let i = totalPages - maxVisiblePages; i < totalPages; i++) {
      elements.push({
        type: 'page',
        displayValue: i + 1,
        zeroBasedIndex: i,
      })
    }
  } else {
    // Средняя зона: показываем 1 ... (current-1) current (current+1) ... последняя
    elements.push({
      type: 'page',
      displayValue: 1,
      zeroBasedIndex: 0,
    })

    elements.push({ type: 'ellipsis' })

    // Окно вокруг текущей страницы: показываем 3 страницы (предыдущая, текущая, следующая)
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      elements.push({
        type: 'page',
        displayValue: i + 1,
        zeroBasedIndex: i,
      })
    }

    elements.push({ type: 'ellipsis' })

    elements.push({
      type: 'page',
      displayValue: totalPages,
      zeroBasedIndex: totalPages - 1,
    })
  }

  return elements
}

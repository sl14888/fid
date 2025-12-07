/**
 * Типы элементов пагинации
 */
export type PaginationElement = {
  type: 'page'
  displayValue: number
  zeroBasedIndex: number
}

/**
 * Генерирует массив элементов для отображения в пагинации
 * без троеточий, с фиксированным количеством страниц
 *
 * Логика отображения:
 * - Активная страница всегда слева в окне, пока не достигнем конца
 * - Показываем фиксированное количество страниц (maxVisiblePages)
 * - Когда доходим до конца, показываем последние maxVisiblePages страниц
 *
 * @param currentPage - Текущая активная страница (0-based индексация)
 * @param totalPages - Общее количество страниц
 * @param maxVisiblePages - Максимальное количество видимых страниц (по умолчанию 5 для десктопа, 4 для мобайла)
 * @returns Массив элементов для отображения
 *
 * @example
 * // Для 10 страниц, текущая страница 2 (индекс 1), maxVisiblePages = 5
 * generatePaginationElements(1, 10, 5)
 * // Вернет: [1, 2, 3, 4, 5] (активная страница 2 слева)
 *
 * @example
 * // Для 10 страниц, текущая страница 10 (индекс 9), maxVisiblePages = 5
 * generatePaginationElements(9, 10, 5)
 * // Вернет: [6, 7, 8, 9, 10] (активная страница 10 справа)
 */
export const generatePaginationElements = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): PaginationElement[] => {
  const elements: PaginationElement[] = []

  // Если страниц меньше или равно maxVisiblePages, показываем все
  if (totalPages <= maxVisiblePages) {
    for (let i = 0; i < totalPages; i++) {
      elements.push({
        type: 'page',
        displayValue: i + 1,
        zeroBasedIndex: i,
      })
    }
    return elements
  }

  // Определяем начальную позицию окна
  // Активная страница всегда слева (startPage = currentPage)
  let startPage = currentPage

  // Проверяем, не выходит ли окно за границы
  // Если выходит, сдвигаем окно так, чтобы показывались последние maxVisiblePages страниц
  if (startPage + maxVisiblePages > totalPages) {
    startPage = totalPages - maxVisiblePages
  }

  // Генерируем страницы от startPage до startPage + maxVisiblePages
  for (let i = startPage; i < startPage + maxVisiblePages; i++) {
    elements.push({
      type: 'page',
      displayValue: i + 1,
      zeroBasedIndex: i,
    })
  }

  return elements
}

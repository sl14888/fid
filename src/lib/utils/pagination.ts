/**
 * Типы элементов пагинации
 */
export type PaginationElement = {
  type: 'page'
  displayValue: number
  zeroBasedIndex: number
}

export const generatePaginationElements = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 5
): PaginationElement[] => {
  const elements: PaginationElement[] = []

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

  let startPage = currentPage

  if (startPage + maxVisiblePages > totalPages) {
    startPage = totalPages - maxVisiblePages
  }

  for (let i = startPage; i < startPage + maxVisiblePages; i++) {
    elements.push({
      type: 'page',
      displayValue: i + 1,
      zeroBasedIndex: i,
    })
  }

  return elements
}

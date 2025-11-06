export interface PaginationProps {
  /**
   * Текущая активная страница (1-based индексация)
   * @example 1, 2, 3...
   */
  currentPage: number

  /**
   * Общее количество страниц
   * @example 10
   */
  totalPages: number

  /**
   * Callback-функция при смене страницы
   * @param page - номер выбранной страницы
   */
  onPageChange: (page: number) => void

  /**
   * Количество видимых номеров страниц
   * @default 4
   */
  visiblePages?: number

  /**
   * Отключить взаимодействие со всеми кнопками
   * @default false
   */
  disabled?: boolean

  /**
   * Дополнительный CSS класс для контейнера
   */
  className?: string
}

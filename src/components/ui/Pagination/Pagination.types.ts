export interface PaginationProps {
  /**
   * Текущая активная страница (0-based индексация)
   * Компонент автоматически конвертирует для отображения (показывает +1)
   * @example 0, 1, 2... (отображается как 1, 2, 3...)
   */
  currentPage: number

  /**
   * Общее количество страниц
   * @example 10
   */
  totalPages: number

  /**
   * Callback-функция при смене страницы
   * Возвращает 0-based индекс страницы
   * @param page - номер выбранной страницы (0-based)
   */
  onPageChange: (page: number) => void

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

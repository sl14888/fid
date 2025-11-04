import { InputProps } from '@/components/ui/Input'

/**
 * Пропсы для SearchInput
 */
export interface SearchInputProps extends Omit<InputProps, 'type' | 'rightElement'> {
  /**
   * Задержка перед вызовом onSearch (в миллисекундах)
   * @default 300
   */
  debounce?: number

  /**
   * Функция, вызываемая при поиске (с учетом debounce)
   */
  onSearch?: (value: string) => void

  /**
   * Показывать индикатор загрузки
   * @default false
   */
  loading?: boolean
}

import { KeyboardEvent } from 'react'

export interface NumericKeyboardHandlerParams {
  /**
   * Событие клавиатуры
   */
  event: KeyboardEvent

  /**
   * Текущее значение
   */
  currentValue: number

  /**
   * Минимальное значение (по умолчанию 0)
   */
  minValue?: number

  /**
   * Максимальное значение
   */
  maxValue: number

  /**
   * Шаг изменения при нажатии стрелок (по умолчанию 1)
   */
  step?: number

  /**
   * Callback при изменении значения
   */
  onChange: (value: number) => void
}

/**
 * Универсальная утилита для обработки keyboard navigation в компонентах с числовыми значениями
 * (рейтинг, слайдеры, инпуты с числами и т.д.)
 *
 * Поддерживает:
 * - Arrow keys (Left/Right, Up/Down) для изменения значения на ±step
 * - Home/End для установки минимального/максимального значения
 * - Number keys (0-9) для прямой установки значения
 * - PageUp/PageDown для изменения на ±(step * 10)
 *
 * @param params - Параметры обработчика
 * @returns true если событие было обработано, false в противном случае
 *
 * @example
 * // Использование в компоненте Rating
 * handleNumericKeyboard({
 *   event,
 *   currentValue: rating,
 *   maxValue: 5,
 *   onChange: setRating
 * })
 *
 * @example
 * // Использование в компоненте Slider
 * handleNumericKeyboard({
 *   event,
 *   currentValue: sliderValue,
 *   minValue: 0,
 *   maxValue: 100,
 *   step: 5,
 *   onChange: setSliderValue
 * })
 */
export const handleNumericKeyboard = ({
  event,
  currentValue,
  minValue = 0,
  maxValue,
  step = 1,
  onChange,
}: NumericKeyboardHandlerParams): boolean => {
  let newValue = currentValue

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault()
      newValue = Math.min(currentValue + step, maxValue)
      break

    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault()
      newValue = Math.max(currentValue - step, minValue)
      break

    case 'PageUp':
      event.preventDefault()
      newValue = Math.min(currentValue + step * 10, maxValue)
      break

    case 'PageDown':
      event.preventDefault()
      newValue = Math.max(currentValue - step * 10, minValue)
      break

    case 'Home':
      event.preventDefault()
      newValue = minValue > 0 ? minValue : 1
      break

    case 'End':
      event.preventDefault()
      newValue = maxValue
      break

    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      event.preventDefault()
      const numValue = parseInt(event.key, 10)
      if (numValue >= minValue && numValue <= maxValue) {
        newValue = numValue
      } else {
        return false
      }
      break

    default:
      // Неподдерживаемая клавиша
      return false
  }

  if (newValue !== currentValue) {
    onChange(newValue)
    return true
  }

  return false
}

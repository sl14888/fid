import { useCallback } from 'react'
import type { KeyboardEvent } from 'react'

const PAGE_STEP_MULTIPLIER = 10
const HOME_MIN_FALLBACK = 1

export interface UseNumericKeyboardParams {
  currentValue: number
  maxValue: number
  onChange: (value: number) => void
  minValue?: number
  step?: number
  isDisabled?: boolean
}

export type NumericKeyboardHandler<
  ElementType extends HTMLElement = HTMLElement,
> = (event: KeyboardEvent<ElementType>) => boolean

export const useNumericKeyboard = <
  ElementType extends HTMLElement = HTMLElement,
>({
  currentValue,
  maxValue,
  onChange,
  minValue = 0,
  step = 1,
  isDisabled = false,
}: UseNumericKeyboardParams): NumericKeyboardHandler<ElementType> =>
  useCallback(
    (event: KeyboardEvent<ElementType>) => {
      if (isDisabled) {
        return false
      }

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
          newValue = Math.min(
            currentValue + step * PAGE_STEP_MULTIPLIER,
            maxValue
          )
          break

        case 'PageDown':
          event.preventDefault()
          newValue = Math.max(
            currentValue - step * PAGE_STEP_MULTIPLIER,
            minValue
          )
          break

        case 'Home':
          event.preventDefault()
          newValue = minValue > 0 ? minValue : HOME_MIN_FALLBACK
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
        case '9': {
          event.preventDefault()
          const numericValue = Number.parseInt(event.key, 10)

          if (numericValue >= minValue && numericValue <= maxValue) {
            newValue = numericValue
            break
          }

          return false
        }

        default:
          return false
      }

      if (newValue !== currentValue) {
        onChange(newValue)
        return true
      }

      return false
    },
    [currentValue, isDisabled, maxValue, minValue, onChange, step]
  )

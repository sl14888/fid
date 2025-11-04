'use client'

import { FC, useState, useCallback, KeyboardEvent, useMemo } from 'react'
import clsx from 'clsx'
import { Icon } from '../Icon'
import { IconName, IconSize } from '../Icon/Icon.types'
import { handleNumericKeyboard } from '@/lib/utils/keyboard'
import { RatingProps, RatingSize } from './Rating.types'
import styles from './Rating.module.scss'

/**
 * Функция для определения цвета звезд в зависимости от рейтинга
 * 5 звезд - желтый, 4 - светло-оранжевый, 3 - оранжевый, 2 - темно-оранжевый, 1 - красно-оранжевый
 */
const getRatingColor = (value: number): string => {
  if (value >= 5) return 'var(--rating-color-5)'
  if (value >= 4) return 'var(--rating-color-4)'
  if (value >= 3) return 'var(--rating-color-3)'
  if (value >= 2) return 'var(--rating-color-2)'
  if (value >= 1) return 'var(--rating-color-1)'
  return 'var(--rating-color-inactive)'
}

export const Rating: FC<RatingProps> = ({
  value = 0,
  maxValue = 5,
  size = RatingSize.Large,
  disabled = false,
  readonly = false,
  onChange,
  className,
  ...rest
}) => {
  const [hoverValue, setHoverValue] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const displayValue = hoverValue || value

  const starColor = useMemo(() => getRatingColor(displayValue), [displayValue])

  const handleClick = useCallback(
    (starIndex: number) => {
      if (disabled || readonly) return
      const newValue = starIndex + 1

      if (newValue === value) {
        onChange?.(0)
      } else {
        onChange?.(newValue)
      }

      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    },
    [disabled, readonly, onChange, value]
  )

  const handleMouseEnter = useCallback(
    (starIndex: number) => {
      if (disabled || readonly) return
      setHoverValue(starIndex + 1)
    },
    [disabled, readonly]
  )

  const handleMouseLeave = useCallback(() => {
    if (disabled || readonly) return
    setHoverValue(0)
  }, [disabled, readonly])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || readonly || !onChange) return

      handleNumericKeyboard({
        event,
        currentValue: value,
        maxValue,
        onChange,
      })
    },
    [value, maxValue, disabled, readonly, onChange]
  )

  const iconSize = size === RatingSize.Small ? IconSize.Small : IconSize.Large

  const containerClasses = clsx(
    styles.rating,
    styles[`rating--${size}`],
    {
      [styles['rating--disabled']]: disabled,
      [styles['rating--readonly']]: readonly,
      [styles['rating--interactive']]: !disabled && !readonly,
      [styles['rating--animating']]: isAnimating,
    },
    className
  )

  return (
    <div
      className={containerClasses}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label={`Рейтинг: ${value} из ${maxValue}`}
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuenow={value}
      aria-disabled={disabled}
      aria-readonly={readonly}
      tabIndex={disabled || readonly ? -1 : 0}
      style={
        {
          '--star-color': starColor,
        } as React.CSSProperties
      }
      {...rest}
    >
      {Array.from({ length: maxValue }).map((_, index) => {
        const isActive = index < displayValue
        const starDelay = `${index * 50}ms` // Каскадная анимация

        return (
          <button
            key={index}
            type="button"
            className={clsx(styles.rating__star, {
              [styles['rating__star--active']]: isActive,
            })}
            style={{
              animationDelay: starDelay,
            }}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={disabled}
            tabIndex={-1}
            aria-label={`Оценить на ${index + 1} из ${maxValue}`}
          >
            <Icon
              name={IconName.Star}
              size={iconSize}
              className={styles.rating__icon}
            />
          </button>
        )
      })}
    </div>
  )
}

Rating.displayName = 'Rating'

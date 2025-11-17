'use client'

import { forwardRef, useId } from 'react'
import clsx from 'clsx'
import { SwitchProps, SwitchSize, SwitchLabelPosition } from './Switch.types'
import styles from './Switch.module.scss'

/**
 * Switch - Компонент переключателя (toggle)
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = SwitchSize.Large,
      label,
      labelPosition = SwitchLabelPosition.Left,
      checked = false,
      disabled = false,
      onChange,
      className,
      id,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const switchId = id || generatedId

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      onChange?.(event.target.checked)
    }

    const switchElement = (
      <label
        htmlFor={switchId}
        className={clsx(
          styles.switch,
          styles[`switch--${size}`],
          {
            [styles['switch--checked']]: checked,
            [styles['switch--disabled']]: disabled,
          },
          className
        )}
      >
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className={styles.switch__input}
          aria-checked={checked}
          aria-label={ariaLabel || label}
          {...rest}
        />
        <span className={styles.switch__track}>
          <span className={styles.switch__thumb} />
        </span>
      </label>
    )

    // Если есть label, оборачиваем в контейнер
    if (label) {
      return (
        <div
          className={clsx(styles.container, {
            [styles['container--disabled']]: disabled,
          })}
        >
          {labelPosition === SwitchLabelPosition.Left && (
            <span className={styles.label}>{label}</span>
          )}
          {switchElement}
          {labelPosition === SwitchLabelPosition.Right && (
            <span className={styles.label}>{label}</span>
          )}
        </div>
      )
    }

    return switchElement
  }
)

Switch.displayName = 'Switch'

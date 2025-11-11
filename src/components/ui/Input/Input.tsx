'use client'

import { forwardRef, useState, useEffect, useId } from 'react'
import clsx from 'clsx'
import { InputProps, InputSize } from './Input.types'
import styles from './Input.module.scss'

/**
 * Базовый компонент Input с floating label
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = InputSize.Large,
      rightElement,
      className,
      inputClassName,
      required,
      disabled,
      fluid = false,
      disableFloatingLabel = false,
      hideHelperTextArea = false,
      value,
      onChangeValue,
      onChange,
      onFocus,
      onBlur,
      id,
      'aria-autocomplete': ariaAutocomplete,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const generatedId = useId()
    const inputId = id || generatedId

    // Обновляем hasValue при изменении value или defaultValue
    useEffect(() => {
      setHasValue(!!value || !!props.defaultValue)
    }, [value, props.defaultValue])

    const isLabelFloating = disableFloatingLabel || isFocused || hasValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setHasValue(!!newValue)
      onChangeValue?.(newValue)
      onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div
        className={clsx(styles.container, className, {
          [styles.fluid]: fluid,
        })}
      >
        <div
          className={clsx(styles.inputWrapper, styles[size], {
            [styles.focused]: isFocused,
            [styles.error]: !!error,
            [styles.disabled]: disabled,
            [styles.hasRightElement]: !!rightElement,
            [styles.hasLabel]: !!label,
            [styles.labelFloating]: isLabelFloating,
          })}
        >
          {label && (
            <label
              htmlFor={inputId}
              className={clsx(styles.label, {
                [styles.floating]: isLabelFloating,
                [styles.required]: required,
              })}
            >
              {label}
            </label>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(styles.input, inputClassName)}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-autocomplete={ariaAutocomplete}
            {...props}
          />

          {rightElement && (
            <div className={styles.rightElement}>{rightElement}</div>
          )}
        </div>

        {/* Вспомогательный текст - всегда рендерим для предотвращения прыжков */}
        {!hideHelperTextArea && (
          <div
            className={clsx(styles.downText, {
              [styles.errorText]: error,
              [styles.helperText]: helperText,
            })}
          >
            {error || helperText || '\u00A0'}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

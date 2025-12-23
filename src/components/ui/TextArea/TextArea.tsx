'use client'

import { forwardRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { TextAreaProps, TextAreaSize, TextAreaResize } from './TextArea.types'
import styles from './TextArea.module.scss'

/**
 * Компонент TextArea с floating label и счетчиком символов
 * @example
 * // С react-hook-form
 * <TextArea
 *   label="Описание"
 *   {...register('description')}
 *   error={errors.description?.message}
 * />
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      size = TextAreaSize.Medium,
      showCounter = false,
      maxLength,
      rows = 3,
      resize = TextAreaResize.None,
      className,
      textareaClassName,
      required,
      disabled,
      value,
      onChangeValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const [isMounted, setIsMounted] = useState(false)

    // Монтирование только на клиенте (для счётчика символов)
    useEffect(() => {
      queueMicrotask(() => {
        setIsMounted(true)
      })
    }, [])

    // Синхронизируем hasValue и charCount при изменении value или defaultValue
    useEffect(() => {
      const currentValue =
        value?.toString() || props.defaultValue?.toString() || ''
      // eslint-disable-next-line
      setHasValue(!!currentValue)
      setCharCount(currentValue.length)
    }, [value, props.defaultValue])

    // Проверяем, должен ли label быть поднят
    const isLabelFloating = isFocused || hasValue || !!props.placeholder

    // Обработчик изменения
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setHasValue(!!newValue)
      setCharCount(newValue.length)
      onChangeValue?.(newValue)
      onChange?.(e)
    }

    // Обработчик фокуса
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    // Обработчик потери фокуса
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div className={clsx(styles.container, className)}>
        <div
          className={clsx(
            styles.textareaWrapper,
            styles[size],
            styles[`resize-${resize}`],
            {
              [styles.focused]: isFocused,
              [styles.error]: !!error,
              [styles.disabled]: disabled,
            }
          )}
        >
          {/* TextArea элемент */}
          <textarea
            ref={ref}
            className={clsx(styles.textarea, textareaClassName, {
              [styles.hasLabel]: !!label,
            })}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Floating label */}
          {label && (
            <label
              className={clsx(styles.label, {
                [styles.floating]: isLabelFloating,
                [styles.required]: required,
              })}
            >
              {label}
            </label>
          )}
        </div>

        {/* Футер с вспомогательным текстом и счетчиком */}
        {(helperText || error || showCounter) && (
          <div className={styles.footer}>
            {/* Вспомогательный текст или ошибка */}
            <div
              className={clsx(styles.helperText, {
                [styles.errorText]: !!error,
              })}
            >
              {error || helperText || ''}
            </div>

            {/* Счетчик символов */}
            {showCounter && maxLength && isMounted && (
              <div
                className={clsx(styles.counter, {
                  [styles.counterWarning]: charCount > maxLength * 0.9,
                  [styles.counterError]: charCount >= maxLength,
                })}
              >
                {charCount} / {maxLength}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

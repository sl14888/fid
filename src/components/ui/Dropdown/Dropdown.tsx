'use client'

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@/components/ui/Icon/Icon'
import { IconName } from '@/components/ui/Icon/Icon.types'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import type { DropdownOption, DropdownProps } from './Dropdown.types'
import { DropdownSize } from './Dropdown.types'
import styles from './Dropdown.module.scss'
import { BREAKPOINTS } from '@/constants/breakpoints'

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      triggerText,
      title,
      options,
      value,
      onChange,
      disabled = false,
      className,
      id,
      'aria-label': ariaLabel,
      noOptionsText = 'Нет опций',
      onOpen,
      onClose,
      variant = 'label',
      placeholder,
      size = DropdownSize.Large,
      label,
      error,
      helperText,
      fluid = false,
      required,
      hideHelperTextArea = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [openUpward, setOpenUpward] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const generatedId = useId()
    const dropdownId = id || generatedId
    const menuId = `${dropdownId}-menu`

    const isMobile = useMediaQuery(BREAKPOINTS.MD)

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    )

    const hasValue = !!selectedOption
    const isLabelFloating = isFocused || hasValue || isOpen

    // Проверка позиции для открытия вверх/вниз
    useEffect(() => {
      if (isMobile || !dropdownRef.current) return

      const checkPosition = () => {
        if (!dropdownRef.current) return

        const rect = dropdownRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top

        setOpenUpward(spaceBelow < 300 && spaceAbove > spaceBelow)
      }

      checkPosition()
      window.addEventListener('scroll', checkPosition, true)
      window.addEventListener('resize', checkPosition)

      return () => {
        window.removeEventListener('scroll', checkPosition, true)
        window.removeEventListener('resize', checkPosition)
      }
    }, [isMobile])

    // Закрытие при клике вне dropdown
    useEffect(() => {
      if (!isOpen || isMobile) return

      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
          setIsFocused(false)
          onClose?.()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, isMobile, onClose])

    useEffect(() => {
      if (disabled && isOpen) {
        queueMicrotask(() => {
          setIsOpen(false)
          setIsFocused(false)
          onClose?.()
        })
      }
    }, [disabled, isOpen, onClose])

    const handleToggle = () => {
      if (disabled) return
      setIsOpen(!isOpen)
      if (!isOpen) {
        setIsFocused(true)
        onOpen?.()
      } else {
        setIsFocused(false)
        onClose?.()
      }
    }

    const handleFocus = () => {
      if (disabled) return
      setIsFocused(true)
    }

    const handleBlur = () => {
      if (disabled) return
      setIsFocused(false)
    }

    const handleSelect = (option: DropdownOption) => {
      if (option.disabled) return
      onChange?.(option.value)
      setIsOpen(false)
      onClose?.()

      if (!isMobile && dropdownRef.current) {
        dropdownRef.current.style.pointerEvents = 'none'
        setTimeout(() => {
          if (dropdownRef.current) {
            dropdownRef.current.style.pointerEvents = ''
          }
        }, 300)
      }
    }

    const renderOptions = () => {
      if (options.length === 0) {
        return <li className={styles.noOptions}>{noOptionsText}</li>
      }

      return options.map((option) => {
        const isSelected = option.value === value

        return (
          <li
            key={option.value}
            className={clsx(styles.option, {
              [styles.selected]: isSelected,
              [styles.disabled]: option.disabled,
            })}
            role="option"
            aria-selected={isSelected}
            aria-disabled={option.disabled}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </li>
        )
      })
    }

    const renderTrigger = () => {
      if (variant === 'input') {
        return (
          <>
            <div
              className={clsx(styles.inputWrapper, styles[size], {
                [styles.focused]: isFocused,
                [styles.error]: !!error,
                [styles.disabled]: disabled,
                [styles.hasLabel]: !!label,
                [styles.labelFloating]: isLabelFloating,
              })}
            >
              {label && (
                <label
                  htmlFor={dropdownId}
                  className={clsx(styles.label, {
                    [styles.floating]: isLabelFloating,
                    [styles.required]: required,
                  })}
                >
                  {label}
                </label>
              )}

              <input
                type="text"
                id={dropdownId}
                className={styles.input}
                value={selectedOption ? selectedOption.label : ''}
                placeholder={placeholder || triggerText}
                onClick={disabled ? undefined : handleToggle}
                onFocus={handleFocus}
                onBlur={handleBlur}
                readOnly
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen && !disabled}
                aria-label={ariaLabel || label || triggerText}
                aria-controls={
                  isOpen && !isMobile && !disabled ? menuId : undefined
                }
              />

              <div className={styles.rightElement}>
                <span
                  className={clsx(styles.triggerIcon, {
                    [styles.triggerIconOpen]: isOpen && !disabled,
                  })}
                  onClick={!disabled ? handleToggle : undefined}
                >
                  <Icon name={IconName.ArrowDown} />
                </span>
              </div>
            </div>

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
          </>
        )
      }

      return (
        <button
          type="button"
          className={clsx(styles.trigger, {
            [styles.triggerOpen]: isOpen,
            [styles.triggerDisabled]: disabled,
          })}
          onClick={handleToggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || triggerText}
          aria-controls={isOpen && !isMobile ? menuId : undefined}
          id={dropdownId}
        >
          <span className={styles.triggerText}>
            {selectedOption ? selectedOption.label : triggerText}
          </span>
          <span
            className={clsx(styles.triggerIcon, {
              [styles.triggerIconOpen]: isOpen,
            })}
          >
            <Icon name={IconName.ArrowDown} />
          </span>
        </button>
      )
    }

    return (
      <div
        ref={ref}
        className={clsx(
          variant === 'input' ? styles.container : styles.dropdown,
          className,
          {
            [styles.fluid]: fluid && variant === 'input',
          }
        )}
      >
        <div ref={dropdownRef} className={styles.dropdownInner}>
          {renderTrigger()}

          {!isMobile && !disabled && (
            <ul
              className={clsx(styles.menu, {
                [styles.menuUpward]: openUpward,
              })}
              role="listbox"
              id={menuId}
              aria-labelledby={dropdownId}
            >
              {renderOptions()}
            </ul>
          )}
        </div>

        {isMobile && (
          <BottomSheet
            isOpen={isOpen && !disabled}
            onClose={() => {
              setIsOpen(false)
              onClose?.()
            }}
            title={title || triggerText}
          >
            <ul className={styles.menuMobile} role="listbox">
              {renderOptions()}
            </ul>
          </BottomSheet>
        )}
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'

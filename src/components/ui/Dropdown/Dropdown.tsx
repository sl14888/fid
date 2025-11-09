'use client'

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@/components/ui/Icon/Icon'
import { IconName } from '@/components/ui/Icon/Icon.types'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import type { DropdownOption, DropdownProps } from './Dropdown.types'
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
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [openUpward, setOpenUpward] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const generatedId = useId()
    const dropdownId = id || generatedId
    const menuId = `${dropdownId}-menu`

    const isMobile = useMediaQuery(BREAKPOINTS.MD)

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    )

    useEffect(() => {
      if (isMobile || !dropdownRef.current) return

      const checkPosition = () => {
        const rect = dropdownRef.current!.getBoundingClientRect()
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

    const handleToggle = () => {
      if (disabled) return
      setIsOpen(!isOpen)
      if (!isOpen) {
        onOpen?.()
      } else {
        onClose?.()
      }
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

    return (
      <div ref={ref} className={clsx(styles.dropdown, className)}>
        <div ref={dropdownRef} className={styles.dropdownInner}>
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

          {!isMobile && (
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
            isOpen={isOpen}
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

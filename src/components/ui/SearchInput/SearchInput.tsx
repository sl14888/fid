'use client'

import { forwardRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { IconName } from '@/components/ui/Icon'
import { useDebounce } from '@/lib/hooks'
import { SearchInputProps } from './SearchInput.types'
import { Button, ButtonSize, ButtonVariant } from '../Button'
import styles from './SearchInput.module.scss'

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      debounce = 300,
      onSearch,
      loading = false,
      value,
      onChange,
      disableAutoSearch = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState((value as string) || '')

    const currentValue = (value as string) ?? internalValue

    const debouncedValue = useDebounce(currentValue, debounce)

    useEffect(() => {
      if (onSearch && !disableAutoSearch) {
        onSearch(debouncedValue)
      }
    }, [debouncedValue, onSearch, disableAutoSearch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e)
    }

    const handleSearchClick = () => {
      if (onSearch) {
        onSearch(currentValue)
      }
    }

    const rightElement = (
      <Button
        text="Поиск"
        onClick={handleSearchClick}
        iconLeft={IconName.Search}
        variant={ButtonVariant.SecondaryBlue}
        size={ButtonSize.Small}
        tabIndex={-1}
        loading={loading}
        className={styles.searchButton}
        aria-label="Поиск"
      />
    )

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={handleChange}
        rightElement={rightElement}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

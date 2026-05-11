'use client'

import { forwardRef, useState, useEffect, useRef } from 'react'
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
      onButtonClick,
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

    const onSearchRef = useRef(onSearch)
    onSearchRef.current = onSearch

    const isMounted = useRef(false)

    useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true
        return
      }
      if (onSearchRef.current && !disableAutoSearch) {
        onSearchRef.current(debouncedValue)
      }
    }, [debouncedValue, disableAutoSearch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e)
    }

    const handleSearchClick = () => {
      if (onButtonClick) {
        onButtonClick(currentValue)
      } else if (onSearch) {
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

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { LabelM } from '@/components/ui/Typography'
import { Logo } from '@/components/ui/Logo'
import { Dropdown } from '@/components/ui/Dropdown'

import { useAuthStore } from '@/store/auth.store'
import { useAdminDropdown, useProtectedNavigation } from '@/lib/hooks'
import { HEADER_NAV_LINKS, NAV_LINKS } from '@/constants/navigation'

import { HeaderProps } from './Header.types'

import styles from './Header.module.scss'

export const Header = ({
  className,
  showSearch = true,
  ...props
}: HeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const navigate = useProtectedNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const { isInitializing } = useAuthStore()
  const {
    isAdmin,
    options: adminOptions,
    handleSelect: handleAdminSelect,
  } = useAdminDropdown()

  const shouldShowSearch =
    showSearch && pathname !== '/companies' && pathname !== '/users'

  // Очищаем поиск при уходе со страницы companies
  // eslint-disable-next-line react-hooks/set-state-in-effect -- необходимо для синхронизации UI с навигацией
  useEffect(() => {
    if (pathname !== '/companies') {
      setSearchQuery('')
    }
  }, [pathname])

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return

    const searchParams = new URLSearchParams()
    searchParams.set('q', searchQuery.trim())
    router.push(`/companies?${searchParams.toString()}`)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleProfileClick = () => navigate(NAV_LINKS.PROFILE.href)

  return (
    <>
      <header className={clsx(styles.header, className)} {...props}>
        <div
          className={clsx(
            styles.container,
            !shouldShowSearch && styles['container--noSearch']
          )}
        >
          <div className={styles.leftSection}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="Главная страница"
            >
              <Logo className={styles.logoIcon} />
            </Link>

            <nav className={styles.navigation}>
              {HEADER_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                >
                  <LabelM tag="span" color="var(--color-white)">
                    {link.label}
                  </LabelM>
                </Link>
              ))}
            </nav>
          </div>

          {shouldShowSearch && (
            <div className={styles.searchWrapper}>
              <SearchInput
                placeholder="Поиск по компаниям"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearchSubmit}
                onKeyDown={handleSearchKeyDown}
                disableAutoSearch
                className={styles.search}
                hideHelperTextArea
              />
            </div>
          )}

          <div className={styles.rightSection}>
            {isAdmin && (
              <Dropdown
                triggerText="Админка"
                title="Админка"
                options={adminOptions}
                onChange={handleAdminSelect}
                className={styles.adminDropdown}
              />
            )}

            <Button
              text="Профиль"
              variant={ButtonVariant.PrimaryInverse}
              size={ButtonSize.Small}
              onClick={handleProfileClick}
              disabled={isInitializing}
              className={styles.profileButton}
            />
          </div>
        </div>
      </header>

    </>
  )
}

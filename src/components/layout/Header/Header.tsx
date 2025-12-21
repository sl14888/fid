'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { LabelM } from '@/components/ui/Typography'
import { Logo } from '@/components/ui/Logo'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { LoginForm } from '@/components/forms/LoginForm'

import { useAuthStore } from '@/store/auth.store'
import { HEADER_NAV_LINKS, NAV_LINKS } from '@/constants/navigation'

import { ModalSize } from '@/components/ui/Modal/Modal.types'
import { HeaderProps } from './Header.types'

import styles from './Header.module.scss'

export const Header = ({
  className,
  showSearch = true,
  ...props
}: HeaderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated } = useAuthStore()

  const shouldShowSearch = showSearch && pathname !== '/companies'

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

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
  }

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false)
    router.push(NAV_LINKS.REGISTER.href)
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push(NAV_LINKS.PROFILE.href)
    } else {
      setIsLoginModalOpen(true)
    }
  }

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

          <Button
            text="Профиль"
            variant={ButtonVariant.PrimaryInverse}
            size={ButtonSize.Small}
            onClick={handleProfileClick}
            className={styles.profileButton}
          />
        </div>
      </header>

      <ResponsiveModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Войти в профиль"
        size={ModalSize.Small}
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
        />
      </ResponsiveModal>
    </>
  )
}

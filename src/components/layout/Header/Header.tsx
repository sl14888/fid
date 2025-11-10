'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { LabelM } from '@/components/ui/Typography'
import { Logo } from '@/components/ui/Logo'
import { Container } from '@/components/layout/Container'
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // TODO: Интеграция с API поиска в будущем
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
        <Container className={styles.container} noPadding>
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

          {showSearch && (
            <div className={styles.searchWrapper}>
              <SearchInput
                placeholder="Поиск по компаниям"
                onSearch={handleSearch}
                className={styles.search}
                debounce={300}
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
        </Container>
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

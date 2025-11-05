'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { LabelM } from '@/components/ui/Typography'
import { Logo } from '@/components/ui/Logo'
import { Container } from '@/components/layout/Container'
import { HeaderProps } from './Header.types'
import { HEADER_NAV_LINKS } from '@/constants/navigation'

import styles from './Header.module.scss'

export const Header = ({
  className,
  showSearch = true,
  ...props
}: HeaderProps) => {
  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // TODO: Интеграция с API поиска в будущем
  }

  return (
    <header className={clsx(styles.header, className)} {...props}>
      <Container className={styles.container} noPadding>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo} aria-label="Главная страница">
            <Logo className={styles.logoIcon} />
          </Link>

          <nav className={styles.navigation}>
            {HEADER_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
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
          href="/"
          className={styles.profileButton}
        />
      </Container>
    </header>
  )
}

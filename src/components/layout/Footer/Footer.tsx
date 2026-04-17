'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { FooterProps } from './Footer.types'
import { Container } from '@/components/layout/Container'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { FOOTER_NAV_LINKS, FOOTER_NAV_LINKS_INFO, NAV_LINKS } from '@/constants/navigation'
import { ContactModal } from '@/components/modals/ContactModal'
import { useProtectedNavigation } from '@/lib/hooks'
import styles from './Footer.module.scss'

const PROTECTED_FOOTER_HREFS = new Set<string>([NAV_LINKS.REVIEWS.href, NAV_LINKS.PROFILE.href])

export const Footer = ({ className, ...props }: FooterProps) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const navigate = useProtectedNavigation()

  return (
    <>
      <footer
        id="main-footer"
        className={clsx(styles.footer, className)}
        {...props}
      >
        <Container className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <Link
                href="/"
                className={styles.logo}
                aria-label="Главная страница"
              >
                <Logo className={styles.logoIcon} />
              </Link>
              <Button
                variant={ButtonVariant.PrimaryInverse}
                size={ButtonSize.Small}
                onClick={() => setIsContactModalOpen(true)}
              >
                Написать нам
              </Button>
            </div>

            <div className={styles.bottom}>
              <nav className={styles.nav}>
                {FOOTER_NAV_LINKS.map((link) => {
                  const isProtected = PROTECTED_FOOTER_HREFS.has(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={styles.navLink}
                      onClick={
                        isProtected
                          ? (e) => {
                              e.preventDefault()
                              navigate(link.href)
                            }
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              <div className={styles.info}>
                <a href="mailto:info@feedbacks.ru" className={styles.email}>
                  info@feedbacks.ru
                </a>
                <div className={styles.links}>
                  {FOOTER_NAV_LINKS_INFO.slice(0, 2).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={styles.link}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className={styles.linkRow}>
                    {FOOTER_NAV_LINKS_INFO.slice(2).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={styles.link}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  )
}

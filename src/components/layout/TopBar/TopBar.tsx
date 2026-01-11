'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { NAV_LINKS, TOPBAR_LINKS } from '@/constants/navigation'
import { Icon, IconSize } from '@/components/ui/Icon'

import { TopBarProps } from './TopBar.types'

import styles from './TopBar.module.scss'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { ModalSize } from '@/components/ui/Modal'
import { LoginForm } from '@/components/forms/LoginForm'
import { ForgotPasswordModal } from '@/components/modals/ForgotPasswordModal'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'

export const TopBar = ({ className, ...props }: TopBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isAbsolute, setIsAbsolute] = useState(false)
  const [topPosition, setTopPosition] = useState<number | undefined>(undefined)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false)

  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Сбрасываем состояние при смене страницы
    queueMicrotask(() => {
      setIsAbsolute(false)
      setTopPosition(undefined)
    })

    const handleScroll = () => {
      const footer = document.getElementById('main-footer')
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const topBarHeight = 98

      // Как только верхняя граница футера появляется на экране (становится видимой)
      // TopBar должен отлипнуть от низа и остаться над началом футера
      const shouldBeAbsolute = footerRect.top < windowHeight

      if (shouldBeAbsolute) {
        const footerOffsetTop = footer.offsetTop
        setTopPosition(footerOffsetTop - topBarHeight)
        setIsAbsolute(true)
      } else {
        setIsAbsolute(false)
        setTopPosition(undefined)
      }
    }

    // Небольшая задержка для обновления DOM после навигации
    const timeoutId = setTimeout(() => {
      handleScroll()
    }, 0)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    // Отслеживаем изменения размера body для пересчета позиции
    const resizeObserver = new ResizeObserver(() => {
      handleScroll()
    })

    const bodyElement = document.body
    if (bodyElement) {
      resizeObserver.observe(bodyElement)
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      resizeObserver.disconnect()
    }
  }, [pathname])

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
  }

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false)
    router.push(NAV_LINKS.REGISTER.href)
  }

  const handleForgotPasswordClick = () => {
    setIsLoginModalOpen(false)
    setIsForgotPasswordModalOpen(true)
  }

  const handleForgotPasswordClose = () => {
    setIsForgotPasswordModalOpen(false)
  }

  const handleForgotPasswordLoginClick = () => {
    setIsForgotPasswordModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const handleLinkClick = (href: string) => {
    if (href === NAV_LINKS.PROFILE.href && !isAuthenticated) {
      setIsLoginModalOpen(true)
    }
  }

  const getLinkHref = (link: typeof TOPBAR_LINKS[number]) => {
    if (link.href === NAV_LINKS.PROFILE.href && !isAuthenticated) {
      return undefined
    }
    return link.href
  }

  return (
    <>
      <nav
        className={clsx(
          styles.topBar,
          { [styles.absolute]: isAbsolute },
          className
        )}
        style={
          isAbsolute && topPosition !== undefined
            ? { top: `${topPosition}px` }
            : undefined
        }
        {...props}
      >
        <div className={styles.container}>
          {TOPBAR_LINKS.map((link) => {
            const isActive = pathname === link.href
            const linkHref = getLinkHref(link)

            return (
              <Link
                key={link.href}
                href={linkHref ?? '#'}
                className={clsx(styles.link, {
                  [styles.active]: isActive,
                })}
                onClick={(e) => {
                  if (!linkHref) {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }
                }}
              >
                {link.icon && (
                  <Icon
                    name={link.icon}
                    size={IconSize.Medium}
                    className={styles.icon}
                  />
                )}
                <span className={styles.label}>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <ResponsiveModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Войти в профиль"
        size={ModalSize.Small}
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      </ResponsiveModal>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={handleForgotPasswordClose}
        onLoginClick={handleForgotPasswordLoginClick}
      />
    </>
  )
}

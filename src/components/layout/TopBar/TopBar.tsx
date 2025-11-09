'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { TOPBAR_LINKS } from '@/constants/navigation'
import { Icon, IconSize } from '@/components/ui/Icon'

import { TopBarProps } from './TopBar.types'

import styles from './TopBar.module.scss'

export const TopBar = ({ className, ...props }: TopBarProps) => {
  const pathname = usePathname()
  const [isAbsolute, setIsAbsolute] = useState(false)
  const [topPosition, setTopPosition] = useState<number | undefined>(undefined)

  useEffect(() => {
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
        // Вычисляем позицию: offsetTop футера минус высота TopBar
        const footerOffsetTop = footer.offsetTop
        setTopPosition(footerOffsetTop - topBarHeight)
        setIsAbsolute(true)
      } else {
        setIsAbsolute(false)
        setTopPosition(undefined)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
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
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(styles.link, {
                [styles.active]: isActive,
              })}
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
  )
}

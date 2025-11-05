'use client'

import clsx from 'clsx'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TopBar } from '@/components/layout/TopBar'
import { Container } from '@/components/layout/Container'
import { LayoutProps } from './Layout.types'

import styles from './Layout.module.scss'

export const Layout = ({
  children,
  className,
  disableContainer = false,
  showHeader = true,
  showFooter = true,
  showTopBar = true,
  ...props
}: LayoutProps) => {
  return (
    <div className={clsx(styles.layout, className)} {...props}>
      {showHeader && <Header />}

      <main className={styles.main}>
        {disableContainer ? children : <Container>{children}</Container>}
      </main>

      {showFooter && <Footer />}
      {showTopBar && <TopBar />}
    </div>
  )
}

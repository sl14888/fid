import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Roboto } from 'next/font/google'
import { TopLoaderProvider } from '@/components/providers/TopLoaderProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { Layout } from '@/components/layout/Layout'
import { GlobalWidgets } from '@/components/widgets/GlobalWidgets'
import '@/styles/globals.scss'

const roboto = Roboto({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'FID | Отзывы о компаниях',
  description:
    'Платформа для размещения и просмотра отзывов о компаниях. Читайте реальные отзывы сотрудников и делитесь своим опытом работы.',
  keywords: ['отзывы', 'компании', 'работодатели', 'отзывы сотрудников'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale removed for better accessibility
  // Auto-zoom on inputs prevented via CSS (text-size-adjust)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={roboto.className}>
        <TopLoaderProvider />
        <AuthProvider>
          <Suspense fallback={null}>
            <Layout>{children}</Layout>
          </Suspense>
          <GlobalWidgets />
        </AuthProvider>
      </body>
    </html>
  )
}

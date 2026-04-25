import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Roboto } from 'next/font/google'
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

import { SITE_URL } from '@/constants/api'
import { GLOBAL_KEYWORDS } from '@/constants/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      'FID — отзывы о компаниях, услугах и специалистах | Рейтинг и репутация',
    template: '%s | FID',
  },
  description:
    'Читайте реальные отзывы о компаниях и специалистах. Проверяйте репутацию бизнеса. Выбирайте надёжные услуги.',
  keywords: GLOBAL_KEYWORDS,

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'FID',
    title: 'FID — Отзывы о компаниях',
    description: 'Платформа для реальных отзывов о компаниях и товарах.',
    url: SITE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FID — Отзывы о компаниях',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'FID — Отзывы о компаниях',
    description: 'Платформа для реальных отзывов о компаниях и товарах.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },

  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={roboto.className}>
        <GlobalWidgets />
        <AuthProvider>
          <Suspense fallback={null}>
            <Layout>{children}</Layout>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}

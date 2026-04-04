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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://feedbacks.ru'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'FID — Отзывы о компаниях',
    template: '%s | FID',
  },
  description:
    'Платформа для размещения и просмотра отзывов о компаниях. Читайте реальные отзывы сотрудников и делитесь своим опытом работы.',
  keywords: ['отзывы', 'компании', 'работодатели', 'отзывы сотрудников', 'работа'],

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'FID',
    title: 'FID — Отзывы о компаниях',
    description: 'Платформа для реальных отзывов о работодателях.',
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FID — Отзывы о компаниях' }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'FID — Отзывы о компаниях',
    description: 'Платформа для реальных отзывов о работодателях.',
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

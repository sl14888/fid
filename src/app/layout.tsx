import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}

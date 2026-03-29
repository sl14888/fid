import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fid для бизнеса | Управление репутацией компании',
  description:
    'Расширенные возможности для управления страницей компании и работы с отзывами на платформе Fid.',
}

export default function ForBusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

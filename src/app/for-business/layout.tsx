import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FID для бизнеса',
  description:
    'Управление репутацией компании на платформе FID. Расширенные возможности для работы с отзывами.',
  alternates: { canonical: '/for-business' },
  openGraph: { title: 'FID для бизнеса | FID', url: '/for-business', type: 'website' },
}

export default function ForBusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

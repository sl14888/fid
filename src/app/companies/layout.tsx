import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Компании',
  description:
    'Список компаний на платформе FID. Читайте отзывы сотрудников и выбирайте лучших работодателей.',
  alternates: { canonical: '/companies' },
  openGraph: {
    title: 'Компании | FID',
    description: 'Список компаний на платформе FID. Читайте отзывы сотрудников.',
    url: '/companies',
    type: 'website',
  },
}

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

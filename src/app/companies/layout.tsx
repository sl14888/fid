import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Компании',
  description:
    'Список компаний на платформе FID. Читайте реальные отзывы и делитесь своим мнением о компаниях.',
  alternates: { canonical: '/companies' },
  openGraph: {
    title: 'Компании | FID',
    description: 'Список компаний на платформе FID. Читайте реальные отзывы о компаниях.',
    url: '/companies',
    type: 'website',
  },
}

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

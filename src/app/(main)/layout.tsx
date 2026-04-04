import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://feedbacks.ru'

export const metadata: Metadata = {
  title: 'FID — Отзывы о компаниях',
  description:
    'Платформа для размещения и просмотра отзывов о компаниях. Читайте реальные отзывы сотрудников и делитесь своим опытом работы.',
  alternates: { canonical: '/' },
  openGraph: {
    url: SITE_URL,
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FID',
  url: SITE_URL,
  description: 'Платформа для реальных отзывов о работодателях',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/companies?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}

import type { Metadata } from 'next'
import { SITE_URL } from '@/constants/api'

export const metadata: Metadata = {
  title: 'FID — Отзывы о компаниях',
  description:
    'Платформа для размещения и просмотра отзывов о компаниях. Читайте реальные отзывы и делитесь своим мнениям о компаниях.',
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
  description: 'Платформа для реальных отзывов о компаниях',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/companies?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

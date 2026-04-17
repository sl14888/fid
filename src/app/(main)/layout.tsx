import type { Metadata } from 'next'
import { SITE_URL } from '@/constants/api'
import { buildWebSiteJsonLd } from '@/lib/utils/jsonld'

export const metadata: Metadata = {
  title: { absolute: 'FID — отзывы о компаниях, услугах и специалистах | Рейтинг и репутация' },
  description:
    'Читайте реальные отзывы о компаниях и специалистах. Проверяйте репутацию бизнеса. Выбирайте надёжные услуги.',
  alternates: { canonical: '/' },
  openGraph: {
    url: SITE_URL,
    type: 'website',
    title: 'FID — отзывы о компаниях, услугах и специалистах | Рейтинг и репутация',
    description: 'Читайте реальные отзывы о компаниях и специалистах. Проверяйте репутацию бизнеса. Выбирайте надёжные услуги.',
  },
}

const jsonLd = buildWebSiteJsonLd()

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

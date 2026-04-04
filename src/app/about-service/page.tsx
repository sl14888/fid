import { LegalDocument } from '@/components/shared/LegalDocument'
import { Heading2 } from '@/components/ui/Typography'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Правила сервиса',
  description: 'Правила использования платформы FID для размещения отзывов о компаниях.',
  alternates: { canonical: '/about-service' },
  openGraph: { title: 'Правила сервиса | FID', url: '/about-service', type: 'website' },
}

export default function AboutServicePage() {
  return (
    <>
      <Heading2 className={styles.title}>Пользовательское соглашение</Heading2>
      <LegalDocument documentType={LegalDocumentType.ABOUT_SERVICE} />
    </>
  )
}

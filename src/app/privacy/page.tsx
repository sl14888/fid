import { LegalDocument } from '@/components/shared/LegalDocument'
import { Heading2 } from '@/components/ui/Typography'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности сервиса FID — как мы собираем, используем и защищаем ваши данные.',
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Политика конфиденциальности | FID', url: '/privacy', type: 'website' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Heading2 className={styles.title}>Политика конфиденциальности</Heading2>
      <LegalDocument documentType={LegalDocumentType.PRIVACY_POLICY} />
    </>
  )
}

import { LegalDocument } from '@/components/shared/LegalDocument'
import { Heading2 } from '@/components/ui/Typography'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Пользовательское соглашение | Fid',
  description: 'Пользовательское соглашение сервиса Fid',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Heading2 className={styles.title}>Правила сервиса</Heading2>
      <LegalDocument documentType={LegalDocumentType.TERMS_OF_SERVICE} />
    </>
  )
}

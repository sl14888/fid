import { LegalDocument } from '@/components/shared/LegalDocument'
import { Heading2 } from '@/components/ui/Typography'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Правила сервиса | Fid',
  description: 'Правила использования сервиса Fid',
}

export default function AboutServicePage() {
  return (
    <>
      <Heading2 className={styles.title}>Пользовательское соглашение</Heading2>
      <LegalDocument documentType={LegalDocumentType.ABOUT_SERVICE} />
    </>
  )
}

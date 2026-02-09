import { LegalDocument } from '@/components/shared/LegalDocument'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пользовательское соглашение | Fid',
  description: 'Пользовательское соглашение сервиса Fid',
}

export default function TermsOfServicePage() {
  return <LegalDocument documentType={LegalDocumentType.TERMS_OF_SERVICE} />
}

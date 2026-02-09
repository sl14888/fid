import { LegalDocument } from '@/components/shared/LegalDocument'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Правила сервиса | Fid',
  description: 'Правила использования сервиса Fid',
}

export default function AboutServicePage() {
  return <LegalDocument documentType={LegalDocumentType.ABOUT_SERVICE} />
}

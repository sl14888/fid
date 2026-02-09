import { LegalDocument } from '@/components/shared/LegalDocument'
import { LegalDocumentType } from '@/types/legal-document.types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Fid',
  description: 'Политика конфиденциальности сервиса Fid',
}

export default function PrivacyPolicyPage() {
  return <LegalDocument documentType={LegalDocumentType.PRIVACY_POLICY} />
}

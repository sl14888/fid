import type { Metadata } from 'next'
import { serverFetchCompany } from '@/lib/api/server-fetch'
import { CompanyPageClient } from './CompanyPageClient'
import { SITE_URL } from '@/constants/api'
import { buildOrganizationJsonLd } from '@/lib/utils/jsonld'
import { parseCompanyUrlParams } from '@/lib/utils/company-url'
import { buildCompanyPageMetadata } from '@/lib/utils/metadata'

interface Props {
  params: Promise<{ params: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { params: segments } = await params
  const { companyId, slug } = parseCompanyUrlParams(segments)

  if (isNaN(companyId)) {
    return { title: 'Компания не найдена' }
  }

  const company = await serverFetchCompany(companyId)

  if (!company) {
    return {
      title: 'Компания',
      description: 'Информация о компании на платформе FID',
    }
  }

  return buildCompanyPageMetadata(company, slug, companyId)
}

export default async function CompanyPage({ params }: Props) {
  const { params: segments } = await params
  const { companyId, slug } = parseCompanyUrlParams(segments)
  const company = await serverFetchCompany(companyId)

  const pageUrl = slug
    ? `${SITE_URL}/companies/${slug}/${companyId}`
    : `${SITE_URL}/companies/${companyId}`

  const jsonLd = company ? buildOrganizationJsonLd(company, pageUrl) : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CompanyPageClient companyId={companyId} />
    </>
  )
}

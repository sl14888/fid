import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { getCompanyById } from '@/lib/api/companies.api'

export function parseCompanyUrlParams(segments: string[]): { companyId: number; slug: string | null } {
  if (segments.length === 2) {
    return { slug: segments[0], companyId: Number(segments[1]) }
  }
  return { slug: null, companyId: Number(segments[0]) }
}

export function getCompanyUrl(company: { id: number; slug?: string | null }): string {
  if (company.slug) return `/companies/${company.slug}/${company.id}`
  return `/companies/${company.id}`
}

// TODO: удалить эту функцию когда бэк добавит slug во все list-эндпоинты
// (sortCompanies, topCompanies, getAllCompanies, searchCompanies).
// После этого заменить вызовы navigateToCompany на router.push(getCompanyUrl(company)).
export async function navigateToCompany(
  router: AppRouterInstance,
  company: { id: number; slug?: string | null }
): Promise<void> {
  if (company.slug) {
    router.push(getCompanyUrl(company))
    return
  }
  const full = await getCompanyById(company.id)
  router.push(getCompanyUrl(full))
}

import type { CompanyWithFeedbacksDto } from '@/types/company.types'
import type { FeedbackDto } from '@/types/feedback.types'
import type { CompanyEntity } from '@/lib/api/companies.api'

const BACKEND_URL = process.env.BACKEND_URL || 'http://217.12.40.3:8080'

export async function serverFetchCompany(id: number): Promise<CompanyWithFeedbacksDto | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/companies/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json: { data: CompanyWithFeedbacksDto | null } = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

export async function serverFetchFeedback(id: number): Promise<FeedbackDto | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/feedbacks/${id}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json: { data: FeedbackDto | null } = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

export async function serverFetchAllCompanies(): Promise<CompanyEntity[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/companies/all`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json: { data: CompanyEntity[] | null } = await res.json()
    return json.data ?? []
  } catch {
    return []
  }
}

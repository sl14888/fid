import { axiosPublicInstance } from './axios'
import type {
  ResponseDtoLegalDocument,
  LegalDocumentType,
} from '@/types/legal-document.types'

const ENDPOINTS = {
  GET_BY_TYPE: (type: LegalDocumentType) => `/api/v1/legal-document/type/${type}`,
}

export const getLegalDocument = async (
  documentType: LegalDocumentType
): Promise<ResponseDtoLegalDocument> => {
  const response = await axiosPublicInstance.get<ResponseDtoLegalDocument>(
    ENDPOINTS.GET_BY_TYPE(documentType)
  )
  return response.data
}

export const legalDocumentsApi = {
  getLegalDocument,
}

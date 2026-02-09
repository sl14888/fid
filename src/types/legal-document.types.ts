export enum LegalDocumentType {
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  ABOUT_SERVICE = 'ABOUT_SERVICE',
}

export enum MarkupType {
  MARKDOWN = 'MARKDOWN',
  HTML = 'HTML',
}

export interface LegalDocumentResponse {
  documentType: LegalDocumentType
  version: number
  text: string
  markup: MarkupType
}

export interface ResponseDtoLegalDocument {
  data: LegalDocumentResponse
  success: boolean
  message?: string
}

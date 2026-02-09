import { create } from 'zustand'
import { api } from '@/lib/api'
import type {
  LegalDocumentResponse,
  LegalDocumentType,
} from '@/types/legal-document.types'

interface LegalDocumentsState {
  currentDocument: LegalDocumentResponse | null
  isLoading: boolean
  error: string | null

  fetchDocument: (documentType: LegalDocumentType) => Promise<void>
  clearError: () => void
  reset: () => void
}

const initialState = {
  currentDocument: null,
  isLoading: false,
  error: null,
}

export const useLegalDocumentsStore = create<LegalDocumentsState>((set) => ({
  ...initialState,

  fetchDocument: async (documentType: LegalDocumentType) => {
    set({ isLoading: true, error: null })

    try {
      const response = await api.legalDocuments.getLegalDocument(documentType)

      if (response.success && response.data) {
        set({
          currentDocument: response.data,
          isLoading: false,
        })
      } else {
        set({
          error: response.message || 'Ошибка загрузки документа',
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: `Ошибка загрузки документа: ${error}`,
        isLoading: false,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))

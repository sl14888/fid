import { create } from 'zustand'
import { api } from '@/lib/api'
import type { FaqItemDto } from '@/types/faq.types'

interface FaqState {
  items: FaqItemDto[]
  isLoading: boolean
  isFetched: boolean
  error: string | null

  fetchFaqItems: () => Promise<void>
}

const initialState = {
  items: [],
  isLoading: false,
  isFetched: false,
  error: null,
}

export const useFaqStore = create<FaqState>((set) => ({
  ...initialState,

  fetchFaqItems: async () => {
    set({ isLoading: true, error: null })

    try {
      const data = await api.faq.getAllFaqItems()

      set({ items: data, isLoading: false, isFetched: true })
    } catch (error) {
      set({
        error: `Ошибка загрузки FAQ: ${error}`,
        isLoading: false,
        isFetched: true,
      })
    }
  },
}))

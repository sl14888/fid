import { create } from 'zustand'
import { api } from '@/lib/api'

interface ContactState {
  isLoading: boolean
  sendMessage: (data: { contact: string; message: string }) => Promise<boolean>
}

export const useContactStore = create<ContactState>((set) => ({
  isLoading: false,

  sendMessage: async (data) => {
    set({ isLoading: true })
    try {
      await api.contact.sendContactMessage(data)
      return true
    } catch {
      return false
    } finally {
      set({ isLoading: false })
    }
  },
}))

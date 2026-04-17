import { create } from 'zustand'

interface VerifyEmailModalState {
  isOpen: boolean
  email: string
  open: (email: string) => void
  close: () => void
}

export const useVerifyEmailModalStore = create<VerifyEmailModalState>((set) => ({
  isOpen: false,
  email: '',
  open: (email: string) => set({ isOpen: true, email }),
  close: () => set({ isOpen: false }),
}))

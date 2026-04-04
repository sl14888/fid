import { useAuthModalStore } from '@/store/auth-modal.store'

/**
 * Хук для управления модалкой авторизации.
 * Состояние хранится в Zustand — все компоненты разделяют одну модалку.
 * Обработка ?auth=required происходит только в AuthModal (один экземпляр).
 */
export const useAuthModal = () => {
  return useAuthModalStore()
}

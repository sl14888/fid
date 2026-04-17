import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useAuthModalStore } from '@/store/auth-modal.store'
import { useVerifyEmailModalStore } from '@/store/verify-email-modal.store'
import { Role } from '@/types/common.types'

const isEmailVerified = (role: Role) =>
  role === Role.VERIFIED_USER || role === Role.ADMIN

const EMAIL_VERIFICATION_REQUIRED_ROUTES = new Set(['/reviews/new'])

export const useProtectedNavigation = () => {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const user = useAuthStore((state) => state.user)
  const openAuthModal = useAuthModalStore((state) => state.open)
  const openVerifyEmailModal = useVerifyEmailModalStore((state) => state.open)

  return useCallback(
    (href: string, beforeNavigate?: () => void) => {
      if (!isAuthenticated && !isInitializing) {
        openAuthModal()
        return
      }

      if (isAuthenticated && user && !isEmailVerified(user.role) && EMAIL_VERIFICATION_REQUIRED_ROUTES.has(href)) {
        openVerifyEmailModal(user.email)
        return
      }

      beforeNavigate?.()
      router.push(href)
    },
    [isAuthenticated, isInitializing, user, openAuthModal, openVerifyEmailModal, router]
  )
}

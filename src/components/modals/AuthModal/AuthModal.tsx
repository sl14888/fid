'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { ModalSize } from '@/components/ui/Modal'
import { LoginForm } from '@/components/forms/LoginForm'
import { ForgotPasswordModal } from '@/components/modals/ForgotPasswordModal'
import { useAuthModalStore } from '@/store/auth-modal.store'
import { useAuthStore } from '@/store/auth.store'
import { NAV_LINKS } from '@/constants/navigation'

export const AuthModal = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isOpen, open, close } = useAuthModalStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  // Единственное место обработки ?auth=required — рендерится один раз в Layout
  useEffect(() => {
    if (isInitializing) return

    const authRequired = searchParams.get('auth')
    if (authRequired !== 'required') return

    // Всегда удаляем параметр из URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('auth')

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    router.replace(newUrl)

    // Открываем модалку только если не залогинен
    if (!isAuthenticated) {
      open()
      toast.error('Необходима авторизация. Пожалуйста, войдите в систему')
    }
  }, [searchParams, isAuthenticated, isInitializing, open, router])

  const handleLoginSuccess = () => {
    router.refresh()
    close()
  }

  const handleRegisterClick = () => {
    close()
    router.push(NAV_LINKS.REGISTER.href)
  }

  const handleForgotPasswordClick = () => {
    close()
    setIsForgotPasswordOpen(true)
  }

  const handleForgotPasswordClose = () => {
    setIsForgotPasswordOpen(false)
  }

  const handleForgotPasswordLoginClick = () => {
    setIsForgotPasswordOpen(false)
    open()
  }

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={close}
        title="Войти в профиль"
        size={ModalSize.Small}
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      </ResponsiveModal>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        onLoginClick={handleForgotPasswordLoginClick}
      />
    </>
  )
}

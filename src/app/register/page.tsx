'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { useAuthStore } from '@/store/auth.store'
import styles from './register.module.scss'
import { Heading2 } from '@/components/ui/Typography'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    scrollIntoView()
  }, [])

  // Редирект если пользователь уже был авторизован при загрузке страницы
  useEffect(() => {
    if (isAuthenticated && !isRegistering) {
      router.push('/')
    }
  }, [isAuthenticated, isRegistering, router])

  const handleSuccess = () => {
    setIsRegistering(true)
    setShowSuccessModal(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    router.push('/')
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div>
      <div className={styles.header}>
        <Heading2>Регистрация</Heading2>
      </div>

      <div className={styles.container}>
        <RegisterForm onSuccess={handleSuccess} />
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Вы зарегистрированы. Подтвердите почту."
        message="Подтвердите почту. Отправили вам письмо со ссылкой. Проверьте все папки электронной почты, в том числе папку «Спам»."
        onConfirm={handleSuccessConfirm}
        confirmButtonText="Закрыть"
      />
    </div>
  )
}

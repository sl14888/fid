'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { SuccessModal } from '@/components/modals/SuccessModal'
import styles from './register.module.scss'
import { Heading2 } from '@/components/ui/Typography'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'

export default function RegisterPage() {
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    scrollIntoView()
  }, [])

  const handleSuccess = () => {
    setShowSuccessModal(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    router.push('/')
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
        title="Отправили письмо для подтверждения почты"
        message="Перейдите по ссылке из письма. Проверьте все папки электронной почты, в том числе папку «Спам»"
        onConfirm={handleSuccessConfirm}
        confirmButtonText="Закрыть"
      />
    </div>
  )
}

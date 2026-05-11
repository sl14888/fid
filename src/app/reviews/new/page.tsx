'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AddReviewForm } from '@/components/forms/AddReviewForm'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { Heading2 } from '@/components/ui/Typography'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'
import styles from './page.module.scss'

export default function NewReviewPage() {
  const router = useRouter()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    scrollIntoView()
  }, [])

  const handleSuccess = (cleanup: () => void) => {
    cleanupRef.current = cleanup
    setShowSuccessModal(true)
  }

  const handleModalClose = () => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setShowSuccessModal(false)
    router.back()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Heading2>Новый отзыв</Heading2>
      </div>

      <div className={styles.container}>
        <AddReviewForm onSuccess={handleSuccess} />
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Отзыв опубликуется после проверки"
        message="Спасибо за ваш отзыв"
        confirmButtonText="Закрыть"
        onConfirm={handleModalClose}
      />
    </div>
  )
}

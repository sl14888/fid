'use client'

import { useEffect, useState } from 'react'
import { AddReviewForm } from '@/components/forms/AddReviewForm'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { Heading2 } from '@/components/ui/Typography'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'
import styles from './page.module.scss'

export default function NewReviewPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    scrollIntoView()
  }, [])

  const handleSuccess = () => {
    setShowSuccessModal(true)
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
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
        onClose={() => setShowSuccessModal(false)}
        title="Отзыв успешно добавлен!"
        message="Спасибо за ваш отзыв. Он появится на сайте после модерации."
        onConfirm={handleSuccessConfirm}
      />
    </div>
  )
}

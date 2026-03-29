'use client'

import { useState } from 'react'
import { BusinessHero } from '@/components/BusinessHero'
import { BusinessFeaturesGrid } from '@/components/BusinessFeaturesGrid'
import { BusinessSteps } from '@/components/BusinessSteps'
import { BusinessFaq } from '@/components/BusinessFaq'
import { ContactModal } from '@/components/modals/ContactModal'

import styles from './page.module.scss'

export default function ForBusinessPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleOpenContactModal = () => setIsContactModalOpen(true)
  const handleCloseContactModal = () => setIsContactModalOpen(false)

  return (
    <div className={styles.page}>
      <BusinessHero onConnectClick={handleOpenContactModal} />
      <BusinessFeaturesGrid />
      <BusinessSteps onConnectClick={handleOpenContactModal} />
      {/* <BusinessCta /> */}
      <BusinessFaq />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
      />
    </div>
  )
}

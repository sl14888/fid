'use client'

import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { EmailSentModal } from '@/components/modals/EmailSentModal'
import { TextLRegular } from '@/components/ui/Typography'
import { ModalSize } from '@/components/ui/Modal'
import { useUsersStore } from '@/store/users.store'
import { useCountdown } from '@/lib/hooks'
import styles from './VerifyEmailModal.module.scss'

interface VerifyEmailModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export const VerifyEmailModal: FC<VerifyEmailModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const { sendVerificationEmail, isSendingVerification } = useUsersStore()
  const {
    isActive: isCooldown,
    remaining,
    start: startCooldown,
  } = useCountdown(60)
  const [isEmailSentModalOpen, setIsEmailSentModalOpen] = useState(false)

  const handleSend = async () => {
    const success = await sendVerificationEmail(email)
    if (success) {
      startCooldown()
      setIsEmailSentModalOpen(true)
    } else {
      toast.error('Не удалось отправить письмо. Попробуйте позже')
    }
  }

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        title="Чтобы оставить отзыв подтвердите почту"
        size={ModalSize.Small}
      >
        <div className={styles.verifyEmailModal}>
          <TextLRegular>Отправим письмо со ссылкой</TextLRegular>

          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Default}
            onClick={handleSend}
            loading={isSendingVerification}
            disabled={isSendingVerification || isCooldown}
            fluid
          >
            {isCooldown ? `Отправить письмо ${remaining}` : 'Отправить письмо'}
          </Button>
        </div>
      </ResponsiveModal>

      <EmailSentModal
        isOpen={isEmailSentModalOpen}
        onClose={() => setIsEmailSentModalOpen(false)}
      />
    </>
  )
}

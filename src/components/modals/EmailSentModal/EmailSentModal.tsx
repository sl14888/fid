import { FC } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { ModalSize } from '@/components/ui/Modal'
import { TextLRegular } from '@/components/ui/Typography'
import styles from './EmailSentModal.module.scss'

interface EmailSentModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EmailSentModal: FC<EmailSentModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Письмо отправлено"
      size={ModalSize.Small}
    >
      <div className={styles.emailSentModal}>
        <TextLRegular className={styles.emailSentModal__message}>
          Проверьте почту. В том числе папку «Спам»
        </TextLRegular>

        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Default}
          onClick={onClose}
          fluid
        >
          Закрыть
        </Button>
      </div>
    </ResponsiveModal>
  )
}

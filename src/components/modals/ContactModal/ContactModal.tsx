'use client'

import { FC, useState, useEffect } from 'react'

import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TextArea, TextAreaResize } from '@/components/ui/TextArea'
import { FormField } from '@/components/forms/FormField'
import { TextLRegular } from '@/components/ui/Typography'
import { ModalSize } from '@/components/ui/Modal/Modal.types'

import { useContactForm } from '@/lib/hooks/useContactForm'

import { ContactModalProps, ContactStep } from './ContactModal.types'
import styles from './ContactModal.module.scss'

export const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<ContactStep>(ContactStep.FORM)

  const { control, errors, isLoading, isSubmitDisabled, isCooldown, cooldownRemaining, onSubmit, resetForm } =
    useContactForm(() => setStep(ContactStep.SUCCESS))

  useEffect(() => {
    if (!isOpen) {
      resetForm()
      setStep(ContactStep.FORM)
    }
  }, [isOpen, resetForm])

  const getTitle = () =>
    step === ContactStep.SUCCESS ? 'Сообщение отправлено' : 'Связаться с нами'

  const renderForm = () => (
    <form onSubmit={onSubmit} className={styles.stepContent}>
      <div className={styles.fields}>
        <FormField name="contact" control={control}>
          <Input
            label="Email или номер телефона"
            type="text"
            error={errors.contact?.message}
            fluid
          />
        </FormField>

        <FormField name="message" control={control}>
          <TextArea
            label="Вопрос, комментарий или предложение"
            error={errors.message?.message}
            resize={TextAreaResize.None}
            rows={3}
            textareaClassName={styles.autoResizeTextarea}
          />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant={ButtonVariant.Primary}
          loading={isLoading}
          disabled={isSubmitDisabled}
          fluid
        >
          {isCooldown ? `Отправить ${cooldownRemaining}` : 'Отправить'}
        </Button>
      </div>
    </form>
  )

  const renderSuccess = () => (
    <div className={styles.stepContent}>
      <div className={styles.successMessage}>
        <TextLRegular>
          Мы получили ваше сообщение и скоро свяжемся с вами
        </TextLRegular>
      </div>
      <div className={styles.actions}>
        <Button
          text="Закрыть"
          variant={ButtonVariant.Primary}
          onClick={onClose}
          fluid
        />
      </div>
    </div>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size={ModalSize.Small}
    >
      <div className={styles.contactModal}>
        {step === ContactStep.FORM ? renderForm() : renderSuccess()}
      </div>
    </ResponsiveModal>
  )
}

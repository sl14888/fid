'use client'

import { FC, useState, useEffect } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { ModalSize } from '@/components/ui/Modal'
import styles from './DatePickerModal.module.scss'

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (date: string) => void
  initialDate?: string | null
  title?: string
}

export const DatePickerModal: FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  title = 'Выберите дату',
}) => {
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date.toISOString().slice(0, 10))
      }
    }
  }, [initialDate, isOpen])

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate)
      onClose()
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={ModalSize.Small}
    >
      <div className={styles.modal}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.dateInput}
        />
        <div className={styles.actions}>
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Default}
            onClick={handleConfirm}
            disabled={!selectedDate}
          >
            Применить
          </Button>

          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={onClose}
          >
            Отмена
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}

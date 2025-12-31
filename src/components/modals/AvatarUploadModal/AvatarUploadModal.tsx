'use client'

import { FC, useRef, useState, ChangeEvent } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { ModalSize } from '@/components/ui/Modal'
import { Avatar, AvatarSize } from '@/components/ui/Avatar'
import { useUsersStore } from '@/store/users.store'
import { useAuthStore } from '@/store/auth.store'
import {
  validateAvatarFile,
  readFileAsDataURL,
} from '@/lib/utils/file-validation'
import styles from './AvatarUploadModal.module.scss'
import { TextMRegular } from '@/components/ui/Typography'

interface AvatarUploadModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatarUrl?: string
}

export const AvatarUploadModal: FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { uploadAvatar, isUploadingAvatar } = useUsersStore()

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setValidationError(null)

    const validation = validateAvatarFile(file)
    if (!validation.valid) {
      setValidationError(validation.error || 'Ошибка валидации файла')
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    try {
      const dataUrl = await readFileAsDataURL(file)
      setSelectedFile(file)
      setPreviewUrl(dataUrl)
    } catch (error) {
      setValidationError('Не удалось загрузить превью изображения')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const success = await uploadAvatar(selectedFile)
    if (success) {
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setValidationError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Изменить аватар"
      size={ModalSize.Small}
    >
      <div className={styles.avatarUploadModal}>
        <div className={styles.avatarUploadModal__preview}>
          <Avatar
            src={displayUrl}
            size={AvatarSize.XL}
            className={styles.avatarUploadModal__avatar}
          />
        </div>

        <div className={styles.avatarUploadModal__actions}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.avatarUploadModal__fileInput}
          />

          <Button
            variant={ButtonVariant.SecondaryBlue}
            size={ButtonSize.Default}
            onClick={handleFileSelect}
            disabled={isUploadingAvatar}
            fluid
          >
            Выбрать файл
          </Button>

          {selectedFile && (
            <TextMRegular className={styles.avatarUploadModal__fileName}>
              {selectedFile.name}
            </TextMRegular>
          )}

          {validationError && (
            <TextMRegular className={styles.avatarUploadModal__error}>
              {validationError}
            </TextMRegular>
          )}
        </div>

        <div className={styles.avatarUploadModal__footer}>
          <Button
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={handleClose}
            disabled={isUploadingAvatar}
          >
            Отмена
          </Button>

          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Default}
            onClick={handleUpload}
            disabled={!selectedFile || isUploadingAvatar}
            loading={isUploadingAvatar}
          >
            Загрузить
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}

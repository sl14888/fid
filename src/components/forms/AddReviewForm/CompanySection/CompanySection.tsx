import { useRef, ChangeEvent, useState } from 'react'
import { Control, FieldErrors, UseFormWatch, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { Button, ButtonVariant, ButtonSize } from '@/components/ui/Button'
import { PhotoThumbnail } from '@/components/ReviewPhotos/PhotoThumbnail'
import { PhotoViewerModal } from '@/components/ReviewPhotos'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { AddReviewFormData } from '@/lib/validations/review.schema'
import { REVIEW_FORM_LIMITS } from '@/constants/forms'
import { EmploymentTypeDto } from '@/types/company.types'
import { validateAvatarFile } from '@/lib/utils/file-validation'
import { showToast } from '@/lib/utils/toast-utils'
import type { CompanyAvatar } from '@/types/file.types'
import styles from './CompanySection.module.scss'
import { IconName } from '@/components/ui/Icon'

interface CompanySectionProps {
  control: Control<AddReviewFormData>
  errors: FieldErrors<AddReviewFormData>
  watch: UseFormWatch<AddReviewFormData>
  employmentTypes: EmploymentTypeDto[]
  isLoadingEmploymentTypes: boolean
  isReadonly?: boolean
  hideAvatar?: boolean
  avatar: CompanyAvatar | null
  isUploadingAvatar: boolean
  onAvatarUpload: (file: File) => void
  onAvatarDelete: () => void
}

export const CompanySection = ({
  control,
  errors,
  watch,
  employmentTypes,
  isLoadingEmploymentTypes,
  isReadonly = false,
  hideAvatar = false,
  avatar,
  isUploadingAvatar,
  onAvatarUpload,
  onAvatarDelete,
}: CompanySectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateAvatarFile(file)
    if (!validation.valid) {
      showToast.error(validation.error || 'Ошибка валидации файла')
      return
    }

    onAvatarUpload(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAvatarViewClick = () => {
    setIsViewerOpen(true)
  }

  const handleDeleteClick = () => {
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      onAvatarDelete()
      setIsConfirmDeleteOpen(false)
      showToast.success('Логотип удален')
    } catch (error) {
      console.error('Ошибка удаления логотипа:', error)
      showToast.error('Не удалось удалить логотип')
    } finally {
      setIsDeleting(false)
    }
  }

  const selectedEmploymentType = watch('company.employmentType')

  const employmentTypeOptions =
    employmentTypes?.map((type) => ({
      value: type.id || 0,
      label: type.description || '',
    })) || []

  const selectedEmploymentTypeLabel =
    employmentTypes?.find((type) => type.id === selectedEmploymentType)
      ?.description || 'Выберите категорию'

  return (
    <div className={styles.section}>
      {!hideAvatar && (
        <div className={styles.avatarSection}>
          {!isReadonly && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isUploadingAvatar}
            />
          )}

          {!avatar && !isReadonly ? (
            <div className={styles.avatarUpload}>
              <Button
                variant={ButtonVariant.SecondaryBlue}
                size={ButtonSize.Small}
                text="Логотип компании"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                loading={isUploadingAvatar}
                iconLeft={IconName.Plus}
                type="button"
              />
              <span className={styles.avatarHint}>
                Желательно не менее 186x186px
              </span>
            </div>
          ) : avatar ? (
            <div className={styles.avatarPreview}>
              <PhotoThumbnail
                url={avatar.url}
                onDelete={isReadonly ? undefined : handleDeleteClick}
                onClick={handleAvatarViewClick}
                isDeleting={isUploadingAvatar}
              />
            </div>
          ) : null}
        </div>
      )}

      <div className={styles.row}>
        <Controller
          name="company.name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Название"
              error={errors.company?.name?.message}
              maxLength={REVIEW_FORM_LIMITS.NAME_MAX_LENGTH}
              required
              fluid
              disabled={isReadonly}
            />
          )}
        />

        <Controller
          name="company.website"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Сайт"
              error={errors.company?.website?.message}
              maxLength={REVIEW_FORM_LIMITS.WEBSITE_MAX_LENGTH}
              fluid
              disabled={isReadonly}
            />
          )}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.dropdownField}>
          <div className={styles.dropdownLabel}></div>
          <Controller
            name="company.employmentType"
            control={control}
            render={({ field }) => (
              <Dropdown
                variant="input"
                placeholder="Категория"
                triggerText={selectedEmploymentTypeLabel}
                options={employmentTypeOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={isLoadingEmploymentTypes || isReadonly}
                noOptionsText={
                  isLoadingEmploymentTypes
                    ? 'Загрузка...'
                    : 'Нет доступных категорий'
                }
              />
            )}
          />
          {errors.company?.employmentType && (
            <p className={styles.error}>
              {errors.company.employmentType.message}
            </p>
          )}
        </div>

        <Controller
          name="company.inn"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="ИНН"
              error={errors.company?.inn?.message}
              maxLength={12}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              fluid
              disabled={isReadonly}
            />
          )}
        />
      </div>

      {avatar && !hideAvatar && (
        <>
          <PhotoViewerModal
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            photos={[avatar]}
            initialIndex={0}
          />

          <ConfirmDeleteModal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  )
}

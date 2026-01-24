'use client'

import { useState } from 'react'
import { CompanySection } from '../AddReviewForm/CompanySection'
import { ReviewSection } from '../AddReviewForm/ReviewSection'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Heading4 } from '@/components/ui/Typography'
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal'
import { DatePickerModal } from '@/components/modals/DatePickerModal'
import { UserSearchModal } from '@/components/UserSearch'
import { useEditReviewForm } from '@/lib/hooks/useEditReviewForm'
import type { FeedbackDto } from '@/types/feedback.types'

import styles from './EditReviewForm.module.scss'

interface EditReviewFormProps {
  feedbackId: number
  initialData: FeedbackDto
  onSuccess?: () => void
}

export const EditReviewForm = ({
  feedbackId,
  initialData,
  onSuccess,
}: EditReviewFormProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    control,
    errors,
    watch,
    handleSubmit,
    employmentTypes,
    isLoadingEmploymentTypes,
    avatar,
    isUploadingAvatar,
    handleAvatarUpload,
    handleAvatarDelete,
    photos,
    isUploading,
    isRestoring,
    handlePhotosUpload,
    handlePhotoDelete,
    handleToggleVisibility,
    handleDeleteCompany,
    isTogglingVisibility,
    isDeletingCompany,
    selectedUser,
    isUserModalOpen,
    isDatePickerOpen,
    editedCreatedTime,
    handleUserSelect,
    handleOpenUserModal,
    handleCloseUserModal,
    handleOpenDatePicker,
    handleCloseDatePicker,
    handleDateConfirm,
    isSubmitting,
  } = useEditReviewForm({
    feedbackId,
    initialData,
    onSuccess,
  })

  const handleConfirmDelete = async () => {
    await handleDeleteCompany()
    setIsDeleteModalOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formContent}>
        <div className={styles.header}>
          <Heading4>Компания</Heading4>
          <Button
            text="Удалить компанию"
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            onClick={() => setIsDeleteModalOpen(true)}
            type="button"
            disabled={isSubmitting || isDeletingCompany}
            className={styles.deleteButton}
          />
        </div>

        <CompanySection
          control={control}
          errors={errors}
          watch={watch}
          employmentTypes={employmentTypes}
          isLoadingEmploymentTypes={isLoadingEmploymentTypes}
          isReadonly={false}
          avatar={avatar}
          isUploadingAvatar={isUploadingAvatar}
          onAvatarUpload={handleAvatarUpload}
          onAvatarDelete={handleAvatarDelete}
        />

        <Heading4>Отзыв</Heading4>
        <ReviewSection
          control={control}
          errors={errors}
          photos={photos}
          isUploading={isUploading}
          isRestoring={isRestoring}
          onPhotosUpload={handlePhotosUpload}
          onPhotoDelete={handlePhotoDelete}
          isEditMode
          selectedUser={selectedUser}
          editedCreatedTime={editedCreatedTime}
          onOpenUserModal={handleOpenUserModal}
          onOpenDatePicker={handleOpenDatePicker}
        />

        <div className={styles.actions}>
          <Button
            text="Опубликовать"
            variant={ButtonVariant.Primary}
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isTogglingVisibility}
            className={styles.submitButton}
          />

          <Button
            text={
              initialData.onView === false ? 'Показать отзыв' : 'Скрыть отзыв'
            }
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Default}
            onClick={handleToggleVisibility}
            type="button"
            loading={isTogglingVisibility}
            disabled={isSubmitting || isTogglingVisibility}
            className={styles.visibilityButton}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingCompany}
        title="Удаление компании"
        description="Вы уверены, что хотите удалить эту компанию?"
      />

      <UserSearchModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        onSelectUser={handleUserSelect}
      />

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={handleCloseDatePicker}
        onConfirm={handleDateConfirm}
        initialDate={editedCreatedTime}
        title="Дата публикации"
      />
    </form>
  )
}

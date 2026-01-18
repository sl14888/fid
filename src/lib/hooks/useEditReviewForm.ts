import { useState, useEffect, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useSessionStorage } from './useSessionStorage'
import { useDebounce } from './useDebounce'
import { useEmploymentTypesStore } from '@/store/employment-types.store'
import { useCompaniesStore } from '@/store/companies.store'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { useEditReviewPhotos } from './useEditReviewPhotos'
import {
  addReviewFormSchema,
  AddReviewFormData,
} from '@/lib/validations/review.schema'
import { ADD_REVIEW_FORM_DEFAULT_VALUES } from '@/constants/forms'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'
import { NAV_LINKS } from '@/constants/navigation'
import { showToast } from '@/lib/utils/toast-utils'
import { uploadPhotos } from '@/lib/api/photos.api'
import { api } from '@/lib/api'
import { FeedbackUpdateDto, FeedbackDto } from '@/types/feedback.types'
import {
  CompanyUpdateDto,
  CompanyWithFeedbacksDto,
} from '@/types/company.types'
import type { CompanyAvatar } from '@/types/file.types'
import type { UserSearchResultDto } from '@/types/user.types'

interface SelectedUser {
  id: number
  name: string
  email: string
}

interface UseEditReviewFormOptions {
  feedbackId: number
  initialData: FeedbackDto | null
  onSuccess?: () => void
}

export const useEditReviewForm = (options: UseEditReviewFormOptions) => {
  const { feedbackId, initialData, onSuccess } = options
  const router = useRouter()

  const {
    employmentTypes,
    isLoading: isLoadingEmploymentTypes,
    fetchAllEmploymentTypes,
  } = useEmploymentTypesStore()
  const {
    updateCompany,
    deleteCompany,
    isLoading: isUpdatingCompany,
  } = useCompaniesStore()
  const {
    updateFeedback,
    setFeedbackVisibility,
    isLoading: isUpdatingFeedback,
  } = useFeedbacksStore()

  const {
    photos,
    photoIds,
    isUploading,
    isRestoring,
    handlePhotosUpload,
    handlePhotoDelete,
    handleClearAll: clearPhotos,
  } = useEditReviewPhotos(initialData?.files || [])

  const [isInitialized, setIsInitialized] = useState(false)
  const [avatar, setAvatar] = useState<CompanyAvatar | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false)
  const [isDeletingCompany, setIsDeletingCompany] = useState(false)

  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [editedCreatedTime, setEditedCreatedTime] = useState<string | null>(
    null
  )

  const [sessionData, setSessionData, clearSessionData] =
    useSessionStorage<AddReviewFormData>(
      SESSION_STORAGE_KEYS.EDIT_REVIEW_FORM,
      ADD_REVIEW_FORM_DEFAULT_VALUES
    )

  const [avatarSessionData, setAvatarSessionData, clearAvatarSessionData] =
    useSessionStorage<CompanyAvatar | null>(
      SESSION_STORAGE_KEYS.EDIT_COMPANY_AVATAR,
      null
    )

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<AddReviewFormData>({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: sessionData,
    mode: 'onChange',
  })

  const watchedCompany = useWatch({ control, name: 'company' })
  const watchedReview = useWatch({ control, name: 'review' })

  const debouncedCompany = useDebounce(watchedCompany, 500)
  const debouncedReview = useDebounce(watchedReview, 500)

  useEffect(() => {
    if (isInitialized) {
      const formData: AddReviewFormData = {
        company: debouncedCompany,
        review: debouncedReview,
      }
      setSessionData(formData)
    }
  }, [debouncedCompany, debouncedReview, setSessionData, isInitialized])

  useEffect(() => {
    const initializeForm = async () => {
      await fetchAllEmploymentTypes()

      if (initialData && initialData.companyId) {
        try {
          const companyData: CompanyWithFeedbacksDto =
            await api.companies.getCompanyById(initialData.companyId)

          setValue('company.name', companyData.name || '')
          setValue(
            'company.employmentType',
            companyData.employmentType?.id || 0
          )
          setValue('company.website', companyData.website || '')
          setValue(
            'company.inn',
            companyData.inn ? String(companyData.inn) : ''
          )
          setValue('company.isExistingCompany', true)
          setValue('review.grade', initialData.grade || 0)
          setValue('review.pluses', initialData.pluses || '')
          setValue('review.minuses', initialData.minuses || '')
          setValue('review.description', initialData.description || '')

          if (initialData.companyAvatar) {
            const companyAvatar: CompanyAvatar = {
              id: 0,
              url: initialData.companyAvatar,
            }
            setAvatar(companyAvatar)
          }

          if (initialData.userName && initialData.userEmail) {
            setSelectedUser({
              id: 0,
              name: initialData.userName,
              email: initialData.userEmail,
            })
          }

          if (initialData.createdTime) {
            setEditedCreatedTime(initialData.createdTime)
          }

          queueMicrotask(() => {
            setIsInitialized(true)
          })
        } catch (error) {
          console.error('Ошибка загрузки данных компании:', error)
          showToast.error('Не удалось загрузить данные компании')
        }
      }
    }

    initializeForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  useEffect(() => {
    if (avatarSessionData && isInitialized) {
      setAvatar(avatarSessionData)
      setValue('company.avatarFileId', avatarSessionData.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized])

  useEffect(() => {
    if (isInitialized) {
      setAvatarSessionData(avatar)
    }
  }, [avatar, setAvatarSessionData, isInitialized])

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      setIsUploadingAvatar(true)

      try {
        const uploadedFiles = await uploadPhotos([file])

        if (uploadedFiles && uploadedFiles.length > 0) {
          const uploadedAvatar: CompanyAvatar = {
            id: uploadedFiles[0].id,
            url: uploadedFiles[0].url,
          }

          setAvatar(uploadedAvatar)
          setValue('company.avatarFileId', uploadedAvatar.id)
          showToast.success('Логотип успешно загружен')
        }
      } catch (error) {
        console.error('Ошибка загрузки логотипа:', error)
        showToast.error('Не удалось загрузить логотип')
      } finally {
        setIsUploadingAvatar(false)
      }
    },
    [setValue]
  )

  const handleAvatarDelete = useCallback(() => {
    setAvatar(null)
    setValue('company.avatarFileId', null)
  }, [setValue])

  const handleToggleVisibility = useCallback(async () => {
    if (!initialData) return

    const newVisibility = initialData.onView === false
    setIsTogglingVisibility(true)

    try {
      const result = await setFeedbackVisibility(feedbackId, newVisibility)
      if (result) {
        showToast.success(newVisibility ? 'Отзыв опубликован' : 'Отзыв скрыт')
      } else {
        showToast.error('Не удалось изменить видимость отзыва')
      }
    } catch (error) {
      console.error('Ошибка изменения видимости:', error)
      showToast.error('Не удалось изменить видимость отзыва')
    } finally {
      setIsTogglingVisibility(false)
    }
  }, [initialData, feedbackId, setFeedbackVisibility])

  const handleDeleteCompany = useCallback(async () => {
    if (!initialData || !initialData.companyId) return

    setIsDeletingCompany(true)

    try {
      const result = await deleteCompany(initialData.companyId)
      if (result) {
        showToast.success('Компания удалена')
        clearSessionData()
        clearPhotos()
        clearAvatarSessionData()
        router.push(NAV_LINKS.ADMIN_REVIEWS.href)
      } else {
        showToast.error('Не удалось удалить компанию')
      }
    } catch (error) {
      console.error('Ошибка удаления компании:', error)
      showToast.error('Не удалось удалить компанию')
    } finally {
      setIsDeletingCompany(false)
    }
  }, [
    initialData,
    deleteCompany,
    clearSessionData,
    clearPhotos,
    clearAvatarSessionData,
    router,
  ])

  const handleUserSelect = useCallback((user: UserSearchResultDto) => {
    setSelectedUser({
      id: user.id,
      name: user.name,
      email: user.mail,
    })
    setIsUserModalOpen(false)
  }, [])

  const handleOpenUserModal = useCallback(() => {
    setIsUserModalOpen(true)
  }, [])

  const handleCloseUserModal = useCallback(() => {
    setIsUserModalOpen(false)
  }, [])

  const handleOpenDatePicker = useCallback(() => {
    setIsDatePickerOpen(true)
  }, [])

  const handleCloseDatePicker = useCallback(() => {
    setIsDatePickerOpen(false)
  }, [])

  const handleDateConfirm = useCallback((date: string) => {
    setEditedCreatedTime(date)
    setIsDatePickerOpen(false)
  }, [])

  const onSubmit = useCallback(
    async (data: AddReviewFormData) => {
      if (!initialData || !initialData.companyId) {
        showToast.error('Ошибка: данные отзыва не найдены')
        return
      }

      const companyUpdateDto: CompanyUpdateDto = {
        name: data.company.name,
        employmentType: data.company.employmentType,
        website: data.company.website || null,
        inn: data.company.inn ? Number(data.company.inn) : null,
      }

      // Форматируем дату в ISO формат с временем для бэкенда
      let formattedCreatedTime: string | null = null
      if (editedCreatedTime) {
        const date = new Date(editedCreatedTime)
        if (!isNaN(date.getTime())) {
          formattedCreatedTime = date.toISOString().replace('Z', '') + '123'
        }
      }

      const feedbackUpdateDto: FeedbackUpdateDto = {
        pluses: data.review.pluses || null,
        minuses: data.review.minuses || null,
        description: data.review.description || null,
        grade: data.review.grade || null,
        files: photoIds.length > 0 ? photoIds : undefined,
        userEmail: selectedUser?.email || null,
        // createdTime: formattedCreatedTime,
      }

      const companyResult = await updateCompany(
        initialData.companyId,
        companyUpdateDto
      )

      if (!companyResult) {
        showToast.error('Ошибка при обновлении компании')
        return
      }

      const feedbackResult = await updateFeedback(feedbackId, feedbackUpdateDto)

      if (feedbackResult) {
        showToast.success('Отзыв успешно обновлен!')
        clearSessionData()
        clearPhotos()
        clearAvatarSessionData()
        onSuccess?.()
        router.push(NAV_LINKS.ADMIN_REVIEWS.href)
      } else {
        showToast.error('Ошибка при обновлении отзыва')
      }
    },
    [
      initialData,
      feedbackId,
      photoIds,
      selectedUser,
      editedCreatedTime,
      updateCompany,
      updateFeedback,
      clearSessionData,
      clearPhotos,
      clearAvatarSessionData,
      onSuccess,
      router,
    ]
  )

  const isSubmitting = isUpdatingCompany || isUpdatingFeedback

  return {
    control,
    errors,
    watch,
    handleSubmit: handleSubmit(onSubmit),

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
    isInitialized,
  }
}

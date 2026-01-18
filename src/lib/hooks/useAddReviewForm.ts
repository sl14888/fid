import { useState, useEffect, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useSessionStorage } from './useSessionStorage'
import { useDebounce } from './useDebounce'
import { useAuthStore } from '@/store/auth.store'
import { useEmploymentTypesStore } from '@/store/employment-types.store'
import { useCompaniesStore } from '@/store/companies.store'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { useReviewPhotos } from './useReviewPhotos'
import {
  addReviewFormSchema,
  AddReviewFormData,
} from '@/lib/validations/review.schema'
import { ADD_REVIEW_FORM_DEFAULT_VALUES } from '@/constants/forms'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'
import { NAV_LINKS } from '@/constants/navigation'
import { showToast } from '@/lib/utils/toast-utils'
import { uploadPhotos } from '@/lib/api/photos.api'
import { FeedbackCreateDto } from '@/types/feedback.types'
import { CompanyWithCountFeedbacksDto } from '@/types/company.types'
import type { CompanyAvatar } from '@/types/file.types'

interface UseAddReviewFormOptions {
  onSuccess?: () => void
}

export const useAddReviewForm = (options?: UseAddReviewFormOptions) => {
  const { onSuccess } = options || {}
  const router = useRouter()

  const { isAuthenticated, user } = useAuthStore()
  const {
    employmentTypes,
    isLoading: isLoadingEmploymentTypes,
    fetchAllEmploymentTypes,
  } = useEmploymentTypesStore()
  const { createCompany, isLoading: isCreatingCompany } = useCompaniesStore()
  const { createFeedback, isLoading: isCreatingFeedback } = useFeedbacksStore()
  const {
    photos,
    photoIds,
    isUploading,
    isRestoring,
    handlePhotosUpload,
    handlePhotoDelete,
    handleClearAll: clearPhotos,
  } = useReviewPhotos()

  const [selectedCompany, setSelectedCompany] =
    useState<CompanyWithCountFeedbacksDto | null>(null)
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false)

  const [avatar, setAvatar] = useState<CompanyAvatar | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [sessionData, setSessionData, clearSessionData] =
    useSessionStorage<AddReviewFormData>(
      SESSION_STORAGE_KEYS.ADD_REVIEW_FORM,
      ADD_REVIEW_FORM_DEFAULT_VALUES
    )

  const [avatarSessionData, setAvatarSessionData, clearAvatarSessionData] =
    useSessionStorage<CompanyAvatar | null>(
      SESSION_STORAGE_KEYS.COMPANY_AVATAR,
      null
    )

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
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
    const formData: AddReviewFormData = {
      company: debouncedCompany,
      review: debouncedReview,
    }
    setSessionData(formData)
  }, [debouncedCompany, debouncedReview, setSessionData])

  useEffect(() => {
    fetchAllEmploymentTypes()

    queueMicrotask(() => {
      if (
        sessionData.company.name ||
        sessionData.company.website ||
        sessionData.company.inn ||
        sessionData.company.employmentType > 0
      ) {
        setShowCompanyForm(true)

        if (sessionData.company.isExistingCompany) {
          setSelectedCompany({
            id: 0,
            name: sessionData.company.name,
            website: sessionData.company.website || null,
            employmentType: { id: sessionData.company.employmentType },
            inn: sessionData.company.inn
              ? Number(sessionData.company.inn)
              : null,
          } as CompanyWithCountFeedbacksDto)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (avatarSessionData) {
      setAvatar(avatarSessionData)
      setValue('company.avatarFileId', avatarSessionData.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setAvatarSessionData(avatar)
  }, [avatar, setAvatarSessionData])

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

  const handleSelectCompany = useCallback(
    (company: CompanyWithCountFeedbacksDto) => {
      setSelectedCompany(company)
      setShowCompanyForm(true)
      setValue('company.name', company.name)
      setValue('company.website', company.website || '')
      setValue('company.employmentType', company.employmentType.id || 0)
      setValue('company.inn', company.inn ? String(company.inn) : '')
      setValue('company.isExistingCompany', true)
    },
    [setValue]
  )

  const handleAddNewCompany = useCallback(() => {
    setSelectedCompany(null)
    setShowCompanyForm(true)
    setValue('company.name', '')
    setValue('company.website', '')
    setValue('company.employmentType', 0)
    setValue('company.inn', '')
    setValue('company.isExistingCompany', false)
    setValue('company.avatarFileId', null)

    setAvatar(null)
    clearAvatarSessionData()
  }, [setValue, clearAvatarSessionData])

  const handleDeleteCompany = useCallback(() => {
    setSelectedCompany(null)
    setShowCompanyForm(false)
    setValue('company.name', '')
    setValue('company.website', '')
    setValue('company.employmentType', 0)
    setValue('company.inn', '')
    setValue('company.isExistingCompany', false)
    setValue('company.avatarFileId', null)

    setAvatar(null)
    clearAvatarSessionData()

    const currentData = sessionData
    setSessionData({
      ...currentData,
      company: {
        name: '',
        website: '',
        employmentType: 0,
        inn: '',
        isExistingCompany: false,
        avatarFileId: null,
      },
    })
  }, [setValue, clearAvatarSessionData, sessionData, setSessionData])

  const handleLoginSuccess = useCallback(() => {
    setIsLoginModalOpen(false)
  }, [])

  const handleRegisterClick = useCallback(() => {
    setIsLoginModalOpen(false)
    router.push(NAV_LINKS.REGISTER.href)
  }, [router])

  const handleForgotPasswordClick = useCallback(() => {
    setIsLoginModalOpen(false)
    setIsForgotPasswordModalOpen(true)
  }, [])

  const handleForgotPasswordClose = useCallback(() => {
    setIsForgotPasswordModalOpen(false)
  }, [])

  const handleForgotPasswordLoginClick = useCallback(() => {
    setIsForgotPasswordModalOpen(false)
    setIsLoginModalOpen(true)
  }, [])

  const onInvalid = useCallback(() => {
    if (!showCompanyForm) {
      showToast.error('Необходимо добавить компанию')
    }
  }, [showCompanyForm])

  const onSubmit = useCallback(
    async (data: AddReviewFormData) => {
      if (!isAuthenticated || !user?.email) {
        setIsLoginModalOpen(true)
        return
      }

      if (!showCompanyForm) {
        showToast.error('Необходимо добавить компанию')
        return
      }

      if (selectedCompany) {
        const feedbackData: FeedbackCreateDto = {
          pluses: data.review.pluses || null,
          minuses: data.review.minuses || null,
          description: data.review.description,
          companyId: selectedCompany.id,
          userEmail: user.email,
          grade: data.review.grade,
          files: photoIds.length > 0 ? photoIds : undefined,
        }

        const result = await createFeedback(feedbackData)

        if (result) {
          showToast.success('Отзыв успешно добавлен!')
          clearSessionData()
          clearPhotos()
          reset(ADD_REVIEW_FORM_DEFAULT_VALUES)
          setSelectedCompany(null)
          onSuccess?.()
        }
      } else {
        const result = await createCompany({
          name: data.company.name,
          employmentType: data.company.employmentType,
          website: data.company.website || null,
          inn: data.company.inn ? Number(data.company.inn) : null,
          avatarFileId: data.company.avatarFileId || null,
          feedback: {
            pluses: data.review.pluses || null,
            minuses: data.review.minuses || null,
            description: data.review.description,
            userEmail: user.email,
            grade: data.review.grade,
            files: photoIds.length > 0 ? photoIds : undefined,
          },
        })

        if (result) {
          showToast.success('Отзыв успешно добавлен!')
          clearSessionData()
          clearPhotos()
          clearAvatarSessionData()
          setAvatar(null)
          reset(ADD_REVIEW_FORM_DEFAULT_VALUES)
          onSuccess?.()
        }
      }
    },
    [
      isAuthenticated,
      user,
      showCompanyForm,
      selectedCompany,
      photoIds,
      createFeedback,
      createCompany,
      clearSessionData,
      clearPhotos,
      clearAvatarSessionData,
      reset,
      onSuccess,
    ]
  )

  const isSubmitting = isCreatingCompany || isCreatingFeedback

  return {
    // Form
    control,
    errors,
    watch,
    handleSubmit: handleSubmit(onSubmit, onInvalid),

    // Company
    selectedCompany,
    showCompanyForm,
    employmentTypes,
    isLoadingEmploymentTypes,
    avatar,
    isUploadingAvatar,
    handleSelectCompany,
    handleAddNewCompany,
    handleDeleteCompany,
    handleAvatarUpload,
    handleAvatarDelete,

    // Review Photos
    photos,
    isUploading,
    isRestoring,
    handlePhotosUpload,
    handlePhotoDelete,

    // Modals
    isLoginModalOpen,
    setIsLoginModalOpen,
    isForgotPasswordModalOpen,
    handleLoginSuccess,
    handleRegisterClick,
    handleForgotPasswordClick,
    handleForgotPasswordClose,
    handleForgotPasswordLoginClick,

    // Submission
    isSubmitting,
  }
}

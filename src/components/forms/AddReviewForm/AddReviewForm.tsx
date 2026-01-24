'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CompanySection, ReviewSection } from './ReviewSection'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Heading4 } from '@/components/ui/Typography'
import { CompanySearchModal } from '@/components/CompanySearch'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { ModalSize } from '@/components/ui/Modal'
import { LoginForm } from '@/components/forms/LoginForm'
import { ForgotPasswordModal } from '@/components/modals/ForgotPasswordModal'
import { useSessionStorage } from '@/lib/hooks/useSessionStorage'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useAuthStore } from '@/store/auth.store'
import { useEmploymentTypesStore } from '@/store/employment-types.store'
import { useCompaniesStore } from '@/store/companies.store'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import { useReviewPhotos } from '@/lib/hooks/useReviewPhotos'
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

import styles from './AddReviewForm.module.scss'
import { useMediaQuery } from '@/lib/hooks'
import { BREAKPOINTS } from '@/constants/breakpoints'

interface AddReviewFormProps {
  onSuccess?: () => void
}

export const AddReviewForm = ({ onSuccess }: AddReviewFormProps) => {
  const isMobile = useMediaQuery(BREAKPOINTS.MD)

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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false)

  const [avatar, setAvatar] = useState<CompanyAvatar | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const isSubmittedRef = useRef(false)

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

    // Проверяем SessionStorage при инициализации
    // Если есть данные компании - показываем форму
    queueMicrotask(() => {
      if (
        sessionData.company.name ||
        sessionData.company.website ||
        sessionData.company.inn ||
        sessionData.company.employmentType > 0
      ) {
        setShowCompanyForm(true)

        // Восстанавливаем selectedCompany если компания была выбрана из БД
        if (sessionData.company.isExistingCompany && sessionData.company.id) {
          setSelectedCompany({
            id: sessionData.company.id,
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

  useEffect(() => {
    return () => {
      if (!isSubmittedRef.current) {
        clearSessionData()
        clearAvatarSessionData()
        clearPhotos()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAvatarUpload = async (file: File) => {
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
  }

  const handleAvatarDelete = () => {
    setAvatar(null)
    setValue('company.avatarFileId', null)
  }

  const handleSelectCompany = (company: CompanyWithCountFeedbacksDto) => {
    setSelectedCompany(company)
    setShowCompanyForm(true)
    setValue('company.name', company.name)
    setValue('company.website', company.website || '')
    setValue('company.employmentType', company.employmentType.id || 0)
    setValue('company.inn', company.inn ? String(company.inn) : '')
    setValue('company.isExistingCompany', true)

    if (company.avatar?.url) {
      setAvatar({
        id: company.avatar.id ?? 0,
        url: company.avatar.url,
      })
    } else {
      setAvatar(null)
    }
  }

  const handleAddNewCompany = () => {
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
  }

  const handleDeleteCompany = () => {
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

    // Очистка SessionStorage для полей компании
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
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
  }

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false)
    router.push(NAV_LINKS.REGISTER.href)
  }

  const handleForgotPasswordClick = () => {
    setIsLoginModalOpen(false)
    setIsForgotPasswordModalOpen(true)
  }

  const handleForgotPasswordClose = () => {
    setIsForgotPasswordModalOpen(false)
  }

  const handleForgotPasswordLoginClick = () => {
    setIsForgotPasswordModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const onInvalid = () => {
    // Если форма невалидна и компания не добавлена показываем toast
    if (!showCompanyForm) {
      showToast.error('Необходимо добавить компанию')
    }
  }

  const onSubmit = async (data: AddReviewFormData) => {
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
        isSubmittedRef.current = true
        showToast.success('Отзыв успешно добавлен!')
        clearSessionData()
        clearPhotos()
        clearAvatarSessionData()
        reset(ADD_REVIEW_FORM_DEFAULT_VALUES)
        setSelectedCompany(null)
        onSuccess?.()
        router.back()
      }
    } else {
      const result = await createCompany({
        name: data.company.name,
        employmentType: data.company.employmentType,
        website: data.company.website || null,
        inn: data.company.inn ? Number(data.company.inn) : null,
        feedback: {
          pluses: data.review.pluses || null,
          minuses: data.review.minuses || null,
          description: data.review.description,
          userEmail: user.email,
          grade: data.review.grade,
          files: photoIds.length > 0 ? photoIds : undefined,
        },
        avatarFileId: data.company.avatarFileId || null,
      })

      if (result) {
        isSubmittedRef.current = true
        showToast.success('Отзыв успешно добавлен!')
        clearSessionData()
        clearPhotos()
        clearAvatarSessionData()
        setAvatar(null)
        reset(ADD_REVIEW_FORM_DEFAULT_VALUES)
        onSuccess?.()
        router.back()
      }
    }
  }

  const isSubmitting = isCreatingCompany || isCreatingFeedback

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className={styles.form}
      >
        <div className={styles.formContent}>
          {!showCompanyForm ? (
            <>
              <Heading4>Компания</Heading4>
              <Button
                text="Выбрать компанию"
                variant={ButtonVariant.SecondaryBlue}
                size={ButtonSize.Default}
                onClick={() => setIsSearchModalOpen(true)}
                type="button"
                className={styles.selectCompanyButton}
              />
            </>
          ) : (
            <>
              <div className={styles.header}>
                <div className={styles.header_company}>
                  <Heading4>Компания</Heading4>
                  <Button
                    variant={ButtonVariant.TransparentBlue}
                    size={ButtonSize.Small}
                    onClick={() => setIsSearchModalOpen(true)}
                    type="button"
                  >
                    Выбрать другую компанию
                  </Button>
                </div>
                {!isMobile && (
                  <Button
                    variant={ButtonVariant.SecondaryGray}
                    size={ButtonSize.Small}
                    onClick={handleDeleteCompany}
                    type="button"
                  >
                    Удалить компанию
                  </Button>
                )}
              </div>
              <CompanySection
                control={control}
                errors={errors}
                watch={watch}
                employmentTypes={employmentTypes}
                isLoadingEmploymentTypes={isLoadingEmploymentTypes}
                isReadonly={selectedCompany !== null}
                avatar={avatar}
                isUploadingAvatar={isUploadingAvatar}
                onAvatarUpload={handleAvatarUpload}
                onAvatarDelete={handleAvatarDelete}
              />
              {isMobile && (
                <Button
                  text="Удалить компанию"
                  variant={ButtonVariant.SecondaryGray}
                  size={ButtonSize.Default}
                  onClick={handleDeleteCompany}
                  type="button"
                  fluid
                  className={styles.deleteButtonMobile}
                />
              )}
            </>
          )}

          <Heading4>Отзыв</Heading4>
          <ReviewSection
            control={control}
            errors={errors}
            photos={photos}
            isUploading={isUploading}
            isRestoring={isRestoring}
            onPhotosUpload={handlePhotosUpload}
            onPhotoDelete={handlePhotoDelete}
          />

          <Button
            text="Продолжить"
            variant="primary"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className={styles.submitButton}
          />
        </div>
      </form>

      <CompanySearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectCompany={handleSelectCompany}
        onAddNewCompany={handleAddNewCompany}
      />

      <ResponsiveModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Войти в профиль"
        size={ModalSize.Small}
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      </ResponsiveModal>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={handleForgotPasswordClose}
        onLoginClick={handleForgotPasswordLoginClick}
      />
    </>
  )
}

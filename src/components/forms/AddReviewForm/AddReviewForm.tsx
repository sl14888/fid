'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CompanySection } from './CompanySection'
import { ReviewSection } from './ReviewSection'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Heading4 } from '@/components/ui/Typography'
import { useSessionStorage } from '@/lib/hooks/useSessionStorage'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useAuthStore } from '@/store/auth.store'
import { useEmploymentTypesStore } from '@/store/employment-types.store'
import { useCompaniesStore } from '@/store/companies.store'
import { useFeedbacksStore } from '@/store/feedbacks.store'
import {
  addReviewFormSchema,
  AddReviewFormData,
} from '@/lib/validations/review.schema'
import { ADD_REVIEW_FORM_DEFAULT_VALUES } from '@/constants/forms'
import { SESSION_STORAGE_KEYS } from '@/constants/session-storage-keys'
import { showToast } from '@/lib/utils/toast-utils'
import { FeedbackCreateDto } from '@/types/feedback.types'

import styles from './AddReviewForm.module.scss'
import { useMediaQuery } from '@/lib/hooks'
import { BREAKPOINTS } from '@/constants/breakpoints'

interface AddReviewFormProps {
  selectedCompanyId?: number
  onSuccess?: () => void
}

export const AddReviewForm = ({
  selectedCompanyId,
  onSuccess,
}: AddReviewFormProps) => {
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

  const [sessionData, setSessionData, clearSessionData] =
    useSessionStorage<AddReviewFormData>(
      SESSION_STORAGE_KEYS.ADD_REVIEW_FORM,
      ADD_REVIEW_FORM_DEFAULT_VALUES
    )

  const isNewCompanyMode = !selectedCompanyId

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddReviewFormData>({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: sessionData,
    mode: 'onBlur',
  })

  const formValues = watch()
  const debouncedFormValues = useDebounce(formValues, 500)

  useEffect(() => {
    fetchAllEmploymentTypes()
  }, [])

  useEffect(() => {
    if (debouncedFormValues) {
      setSessionData(debouncedFormValues)
    }
  }, [debouncedFormValues])

  const handleSubmitWithNewCompany = async (data: AddReviewFormData) => {
    if (!isAuthenticated || !user?.email) {
      router.push('/register')
      return
    }

    const result = await createCompany({
      name: data.company.name,
      address: '',
      employmentType: data.company.employmentType,
      website: data.company.website || null,
      inn: data.company.inn ? Number(data.company.inn) : null,
      feedback: {
        pluses: data.review.pluses || null,
        minuses: data.review.minuses || null,
        description: data.review.description,
        userEmail: user.email,
        grade: data.review.grade,
      },
    })

    if (result) {
      showToast.success('Отзыв успешно добавлен!')
      clearSessionData()
      reset(ADD_REVIEW_FORM_DEFAULT_VALUES)
      onSuccess?.()
    }
  }

  const handleSubmitWithExistingCompany = async (data: AddReviewFormData) => {
    if (!isAuthenticated || !user?.email || !selectedCompanyId) {
      router.push('/register')
      return
    }

    const feedbackData: FeedbackCreateDto = {
      pluses: data.review.pluses || null,
      minuses: data.review.minuses || null,
      description: data.review.description,
      companyId: selectedCompanyId,
      userEmail: user.email,
      grade: data.review.grade,
    }

    const result = await createFeedback(feedbackData)

    if (result) {
      showToast.success('Отзыв успешно добавлен!')
      clearSessionData()
      reset(ADD_REVIEW_FORM_DEFAULT_VALUES)
      onSuccess?.()
    }
  }

  const onSubmit = isNewCompanyMode
    ? handleSubmitWithNewCompany
    : handleSubmitWithExistingCompany

  const isSubmitting = isCreatingCompany || isCreatingFeedback

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formContent}>
        {isNewCompanyMode && (
          <>
            <div className={styles.header}>
              <div className={styles.header_company}>
                <Heading4>Компания</Heading4>
                <Button
                  variant={ButtonVariant.TransparentBlue}
                  size={ButtonSize.Small}
                >
                  Выбрать другую компанию
                </Button>
              </div>
              {!isMobile && (
                <Button
                  variant={ButtonVariant.SecondaryGray}
                  size={ButtonSize.Small}
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
            />
          </>
        )}

        <Heading4>Отзыв</Heading4>
        <ReviewSection control={control} errors={errors} />

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
  )
}

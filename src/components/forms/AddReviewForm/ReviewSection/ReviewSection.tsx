import { Control, FieldErrors, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Rating } from '@/components/ui/Rating'
import { AddReviewFormData } from '@/lib/validations/review.schema'
import { REVIEW_FORM_LIMITS } from '@/constants/forms'
import { LabelM } from '@/components/ui/Typography'
import styles from './ReviewSection.module.scss'

interface ReviewSectionProps {
  control: Control<AddReviewFormData>
  errors: FieldErrors<AddReviewFormData>
}

export const ReviewSection = ({ control, errors }: ReviewSectionProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true)
    })
  }, [])

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <LabelM>Оценка</LabelM>

        {isMounted && (
          <Controller
            name="review.grade"
            control={control}
            render={({ field }) => (
              <Rating
                size="large"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}
        {errors.review?.grade && (
          <p className={styles.error}>{errors.review.grade.message}</p>
        )}
      </div>

      <div className={styles.section_wrapper}>
        <LabelM>Плюсы</LabelM>
        <Controller
          name="review.pluses"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Опишите преимущества"
              helperText="Не более 3 000 символов"
              error={errors.review?.pluses?.message}
              maxLength={REVIEW_FORM_LIMITS.TEXT_FIELD_MAX_LENGTH}
              showCounter
              rows={4}
            />
          )}
        />
      </div>

      <div className={styles.section_wrapper}>
        <LabelM>Минусы</LabelM>
        <Controller
          name="review.minuses"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Что не понравилось"
              helperText="Не более 3 000 символов"
              error={errors.review?.minuses?.message}
              maxLength={REVIEW_FORM_LIMITS.TEXT_FIELD_MAX_LENGTH}
              showCounter
              rows={4}
            />
          )}
        />
      </div>
      <div className={styles.section_wrapper}>
        <LabelM>Комментарий</LabelM>
        <Controller
          name="review.description"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Дополните отзыв"
              helperText="Не более 3 000 символов"
              error={errors.review?.description?.message}
              maxLength={REVIEW_FORM_LIMITS.TEXT_FIELD_MAX_LENGTH}
              showCounter
              required
              rows={4}
            />
          )}
        />
      </div>
    </div>
  )
}

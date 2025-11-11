import { Control, FieldErrors, UseFormWatch, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { AddReviewFormData } from '@/lib/validations/review.schema'
import { REVIEW_FORM_LIMITS } from '@/constants/forms'
import { EmploymentTypeDto } from '@/types/company.types'
import { LabelM } from '@/components/ui/Typography'
import styles from './CompanySection.module.scss'

interface CompanySectionProps {
  control: Control<AddReviewFormData>
  errors: FieldErrors<AddReviewFormData>
  watch: UseFormWatch<AddReviewFormData>
  employmentTypes: EmploymentTypeDto[]
  isLoadingEmploymentTypes: boolean
}

export const CompanySection = ({
  control,
  errors,
  watch,
  employmentTypes,
  isLoadingEmploymentTypes,
}: CompanySectionProps) => {
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
                disabled={isLoadingEmploymentTypes}
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
            />
          )}
        />
      </div>
    </div>
  )
}

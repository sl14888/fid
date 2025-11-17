'use client'

import { FC } from 'react'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { Heading4, TextMRegular } from '@/components/ui/Typography'

import styles from './ReviewsErrorState.module.scss'

interface ReviewsErrorStateProps {
  error?: string
  onRetry?: () => void
  className?: string
}

/**
 * Компонент состояния ошибки загрузки отзывов
 * Отображается когда произошла ошибка при загрузке данных
 */
export const ReviewsErrorState: FC<ReviewsErrorStateProps> = ({
  error = 'Произошла ошибка при загрузке отзывов',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`${styles.errorState} ${className}`}>
      <div className={styles.errorState__content}>
        <Heading4 className={styles.errorState__title}>
          Что-то пошло не так
        </Heading4>
        <TextMRegular className={styles.errorState__description}>
          Произошла ошибка при загрузке отзывов
        </TextMRegular>
        {onRetry && (
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Default}
            onClick={onRetry}
            className={styles.errorState__button}
          >
            Попробовать снова
          </Button>
        )}
      </div>
    </div>
  )
}

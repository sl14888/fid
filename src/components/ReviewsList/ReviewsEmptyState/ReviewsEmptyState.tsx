'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ButtonSize, ButtonVariant } from '@/components/ui/Button/Button.types'
import { Heading4, TextMRegular } from '@/components/ui/Typography'

import styles from './ReviewsEmptyState.module.scss'

interface ReviewsEmptyStateProps {
  className?: string
}

/**
 * Компонент пустого состояния списка отзывов
 * Отображается когда отзывов нет в базе данных
 */
export const ReviewsEmptyState: FC<ReviewsEmptyStateProps> = ({
  className = '',
}) => {
  const router = useRouter()

  const handleAddReview = () => {
    router.push('/reviews/new')
  }

  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.emptyState__content}>
        <Heading4 className={styles.emptyState__title}>
          Пока нет отзывов
        </Heading4>
        <TextMRegular className={styles.emptyState__description}>
          Станьте первым, кто поделится своим опытом работы в компании
        </TextMRegular>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Default}
          onClick={handleAddReview}
          className={styles.emptyState__button}
        >
          Добавить отзыв
        </Button>
      </div>
    </div>
  )
}

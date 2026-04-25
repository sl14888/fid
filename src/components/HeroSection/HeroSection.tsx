import { Button, ButtonVariant } from '@/components/ui/Button'
import { Heading1, TextLRegular } from '@/components/ui/Typography'
import type { HeroSectionProps } from './HeroSection.types'
import styles from './HeroSection.module.scss'

export const HeroSection = ({ onAddReview, children }: HeroSectionProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <Heading1 className={styles.heroTitle}>
          Каждый отзыв - часть истории
        </Heading1>
        <TextLRegular>
          {`
          Помогаем сделать взвешенный выбор.
Проверяем отзывы перед публикацией.
Уместить каждую строку в единую, без переноса на следующую`}
        </TextLRegular>
        <Button
          text="Оставить отзыв"
          variant={ButtonVariant.PrimaryBlack}
          onClick={onAddReview}
          className={styles.heroButton}
        />
      </div>

      {children}
    </section>
  )
}

import { Button, ButtonVariant } from '@/components/ui/Button'
import { Heading1, TextLRegular } from '@/components/ui/Typography'
import type { HeroSectionProps } from './HeroSection.types'
import styles from './HeroSection.module.scss'

export const HeroSection = ({ onAddReview, children }: HeroSectionProps) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <Heading1 className={styles.heroTitle}>
          Управляй репутацией компании
        </Heading1>
        <TextLRegular>
          {`Оставь честное мнение о компании. Отзыв\n опубликуется после проверки.`}
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

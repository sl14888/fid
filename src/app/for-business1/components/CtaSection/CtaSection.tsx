import { Heading2, TextMRegular } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { ButtonVariant } from '@/components/ui/Button/Button.types'
import { Container } from '@/components/layout/Container'

import styles from './CtaSection.module.scss'

export const CtaSection = () => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.content}>
          <Heading2>Подберите пакет под вашу задачу</Heading2>

          <TextMRegular color="var(--color-text-secondary)">
            Расскажите что для вас важно — мы предложим подходящий вариант подключения
          </TextMRegular>

          <Button
            text="Подобрать пакет"
            variant={ButtonVariant.PrimaryBlack}
            href="#"
          />
        </div>
      </Container>
    </section>
  )
}

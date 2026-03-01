import { TextS } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { ButtonVariant, ButtonSize } from '@/components/ui/Button/Button.types'
import { Container } from '@/components/layout/Container'
import { StepCard } from '../StepCard'

import styles from './StepsSection.module.scss'

export const StepsSection = () => {
  return (
    <section className={styles.section}>
      <Container>
        <TextS tag="h2" className={styles.heading}>
          Как подключиться
        </TextS>

        <div className={styles.grid}>
          <StepCard step={1} title="Найдите карточку вашей компании на Fid" />

          <StepCard step={2} title="Подтвердите, что вы представитель" />

          <StepCard
            step={3}
            title="Подключите Fid для бизнеса и настройте карточку"
            variant="accent"
          >
            <Button
              text="Подключить"
              variant={ButtonVariant.PrimaryBlack}
              size={ButtonSize.Small}
              href="#"
              className={styles.stepButton}
            />
          </StepCard>
        </div>
      </Container>
    </section>
  )
}

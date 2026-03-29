'use client'

import { TextLMedium } from '@/components/ui/Typography'
import { Container } from '@/components/layout/Container'
import { BusinessStepCard } from '@/components/BusinessStepCard'

import styles from './BusinessSteps.module.scss'

interface BusinessStepsProps {
  onConnectClick?: () => void
}

export const BusinessSteps = ({ onConnectClick }: BusinessStepsProps) => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card}>
          <TextLMedium className={styles.heading}>Как подключиться</TextLMedium>

          <div className={styles.grid}>
            <BusinessStepCard
              step={1}
              title="Найдите карточку вашей компании на Fid"
            />
            <BusinessStepCard
              step={2}
              title="Подтвердите, что вы представитель"
            />
            <BusinessStepCard
              step="+"
              title="Подключите Fid для бизнеса и настройте карточку"
              variant="accent"
              showConnectButton
              onConnectClick={onConnectClick}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

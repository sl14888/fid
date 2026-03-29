'use client'

import Image from 'next/image'
import { Heading1, TextLMedium, TextXS } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { ButtonVariant, ButtonSize } from '@/components/ui/Button/Button.types'
import { Container } from '@/components/layout/Container'
import OkBlueImg from '../../app/for-business/img/ok-blue.svg'
import fidLargeImg from '../../app/for-business/img/fid-large.png'

import styles from './BusinessHero.module.scss'

interface BusinessHeroProps {
  onConnectClick?: () => void
}

export const BusinessHero = ({ onConnectClick }: BusinessHeroProps) => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card}>
          <div className={styles.inner}>
            <div className={styles.content}>
              <div className={styles.titleRow}>
                <Heading1 className={styles.title}>
                  Подключите <br />
                  для бизнеса
                </Heading1>
                <Image
                  src={fidLargeImg}
                  alt="fid."
                  width={108}
                  height={94}
                  className={styles.fidLogo}
                />
              </div>

              <TextLMedium
                color="rgba(0, 0, 0, 0.70)"
                className={styles.description}
              >
                Расширенные возможности для управления страницей компании и
                работы с отзывами
              </TextLMedium>

              <div className={styles.buttons}>
                <Button
                  text="Подключить"
                  variant={ButtonVariant.PrimaryBlack}
                  size={ButtonSize.Default}
                  onClick={onConnectClick}
                />
              </div>

              <TextXS
                color="var(--color-text-tertiary)"
                className={styles.disclaimer}
              >
                Инструменты работают в рамках правил платформы
              </TextXS>
            </div>

            <div className={styles.illustration}>
              <OkBlueImg
                width={230}
                height={240}
                className={styles.illustrationImg}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

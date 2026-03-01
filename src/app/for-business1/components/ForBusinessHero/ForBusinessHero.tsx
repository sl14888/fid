import Image from 'next/image'
import { Heading1, TextMRegular, TextXS } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { ButtonVariant } from '@/components/ui/Button/Button.types'
import { Container } from '@/components/layout/Container'
import okBlueImg from '../../img/ok-blue.png'
import fidLargeImg from '../../img/fid-large.png'

import styles from './ForBusinessHero.module.scss'

export const ForBusinessHero = () => {
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.content}>
            <Heading1 className={styles.title}>
              Подключите{' '}
              <span className={styles.brand}>
                <Image
                  src={fidLargeImg}
                  alt="fid"
                  width={108}
                  height={94}
                  className={styles.brandImg}
                />
              </span>
              <br />
              для бизнеса
            </Heading1>

            <TextMRegular color="var(--color-text-secondary)">
              Расширенные возможности для управления
              <br />
              страницей компании и работы с отзывами
            </TextMRegular>

            <div className={styles.buttons}>
              <Button
                text="Подключить"
                variant={ButtonVariant.PrimaryBlack}
                href="#"
              />
              <Button
                text="Задать вопрос"
                variant={ButtonVariant.TransparentBlue}
                href="#"
              />
            </div>
          </div>

          <div className={styles.illustration}>
            <Image
              src={okBlueImg}
              alt=""
              width={230}
              height={240}
              className={styles.illustrationImg}
            />
          </div>
        </div>

        <TextXS color="var(--color-text-tertiary)" className={styles.disclaimer}>
          Инструменты работают в рамках правил платформы
        </TextXS>
      </Container>
    </section>
  )
}

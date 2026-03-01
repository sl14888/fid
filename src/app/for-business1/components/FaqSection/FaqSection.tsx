'use client'

import { Container } from '@/components/layout/Container'
import { TextMRegular } from '@/components/ui/Typography'
import { Accordion } from '@/components/ui/Accordion'
import type { AccordionItem } from '@/components/ui/Accordion'

import styles from './FaqSection.module.scss'

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'what-is-fid',
    title: 'Что такое Fid и зачем он нужен?',
    content: (
      <TextMRegular color="var(--color-text-secondary)">
        Fid (Feedback in Details) — это платформа для сбора и анализа отзывов о компаниях,
        товарах и услугах. Сервис помогает пользователям принимать более осознанные решения,
        а бизнесу — получать обратную связь и улучшать качество продукта и сервиса.
      </TextMRegular>
    ),
  },
  {
    id: 'what-gives',
    title: 'Что даёт Fid для бизнеса представителям компании?',
    content: (
      <TextMRegular color="var(--color-text-secondary)">
        Fid для бизнеса предоставляет инструменты для управления страницей компании:
        закрепление и сортировка отзывов, обновление информации, загрузка фотографий,
        получение иконки официального представителя и возможность обращаться в поддержку
        по спорным ситуациям.
      </TextMRegular>
    ),
  },
  {
    id: 'update-info',
    title: 'Можно ли обновлять информацию о компании и оформление карточки?',
    content: (
      <TextMRegular color="var(--color-text-secondary)">
        Да, вы можете обновлять описание компании, контактную информацию, ссылки на сайт
        и социальные сети, а также загружать фотографии и менять оформление карточки.
      </TextMRegular>
    ),
  },
  {
    id: 'reviews-interaction',
    title: 'Как работает взаимодействие с отзывами?',
    content: (
      <TextMRegular color="var(--color-text-secondary)">
        Вы можете закреплять от 1 до 3 ключевых отзывов в верхней части карточки,
        настраивать сортировку отзывов по оценке, полезности или дате,
        а также отвечать на отзывы от имени компании.
      </TextMRegular>
    ),
  },
  {
    id: 'inaccurate-review',
    title: 'Что делать, если отзыв содержит неточности или требует разъяснения?',
    content: (
      <TextMRegular color="var(--color-text-secondary)">
        Вы можете оставить официальный ответ на отзыв, предоставив свою точку зрения.
        Если отзыв нарушает правила платформы, вы можете подать обращение
        на его проверку через инструмент «Решения споров».
      </TextMRegular>
    ),
  },
  {
    id: 'delete-reviews',
    title: 'Вы удаляете отзывы за деньги?',
    content: (
      <TextMRegular color="var(--color-text-secondary)">
        Нет. Fid не удаляет отзывы за деньги. Все отзывы проходят модерацию
        по единым правилам платформы. Удаление возможно только в случае нарушения
        правил публикации.
      </TextMRegular>
    ),
  },
]

export const FaqSection = () => {
  return (
    <section className={styles.section}>
      <Container>
        <Accordion items={FAQ_ITEMS} defaultOpenId="what-is-fid" />
      </Container>
    </section>
  )
}

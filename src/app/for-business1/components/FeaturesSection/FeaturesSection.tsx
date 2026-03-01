import { Container } from '@/components/layout/Container'
import { FeatureCard } from '../FeatureCard'
import commentImg from '../../img/comment.png'
import arrowsImg from '../../img/arrows.png'
import starImg from '../../img/star.png'
import instImg from '../../img/inst.png'
import okSmallImg from '../../img/ok-small.png'
import warningImg from '../../img/warning.png'

import styles from './FeaturesSection.module.scss'

const FEATURES = [
  {
    icon: commentImg,
    title: 'Закрепление отзывов',
    description: '1–3 ключевых отзыва в верхней части карточки',
  },
  {
    icon: arrowsImg,
    title: 'Сортировка отзывов',
    description: 'По оценке, полезности или дате для удобной навигации',
  },
  {
    icon: starImg,
    title: 'Управление страницей',
    description: 'Обновление описания, контактов, ссылок и оформления карточки',
  },
  {
    icon: instImg,
    title: 'Фото и материалы',
    description: 'Обновление фотографий, чтобы профиль выглядел актуально',
  },
  {
    icon: okSmallImg,
    title: 'Официальный профиль',
    description: 'Иконка представителя для повышения доверия аудитории',
  },
  {
    icon: warningImg,
    title: 'Решения споров',
    description: 'Обращения по ситуациям, требующим проверки',
  },
] as const

export const FeaturesSection = () => {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

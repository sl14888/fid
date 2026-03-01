import Image, { StaticImageData } from 'next/image'
import { TextMMedium, TextS } from '@/components/ui/Typography'

import styles from './FeatureCard.module.scss'

interface FeatureCardProps {
  icon: StaticImageData
  title: string
  description: string
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <Image src={icon} alt="" width={48} height={48} />
      </div>
      <TextMMedium className={styles.title}>{title}</TextMMedium>
      <TextS color="var(--color-text-secondary)">{description}</TextS>
    </div>
  )
}

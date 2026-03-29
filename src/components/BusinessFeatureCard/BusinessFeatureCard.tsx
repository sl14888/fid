import Image, { StaticImageData } from 'next/image'
import { Heading5, TextLMedium } from '@/components/ui/Typography'

import styles from './BusinessFeatureCard.module.scss'

interface BusinessFeatureCardProps {
  icon: StaticImageData
  title: string
  description: string
}

export const BusinessFeatureCard = ({ icon, title, description }: BusinessFeatureCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <Image src={icon} alt="" width={100} height={100} />
      </div>
      <div className={styles.textContent}>
        <Heading5>{title}</Heading5>
        <TextLMedium color="var(--color-gray-400)">{description}</TextLMedium>
      </div>
    </div>
  )
}

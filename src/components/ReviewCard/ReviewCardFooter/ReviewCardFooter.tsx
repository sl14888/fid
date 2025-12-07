import { FC } from 'react'
import Link from 'next/link'

import { Icon, IconName, IconSize } from '@/components/ui/Icon'

import styles from '../ReviewCard.module.scss'

interface ReviewCardFooterProps {
  onReadMore?: () => void
  showButton?: boolean
}

export const ReviewCardFooter: FC<ReviewCardFooterProps> = ({
  onReadMore,
  showButton = true,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onReadMore) {
      onReadMore()
    }
  }

  if (!showButton) {
    return null
  }

  return (
    <div className={styles.reviewCard__footer}>
      <Link href="#" onClick={handleClick} className={styles.reviewCard__link}>
        Читать полностью
        <Icon name={IconName.ArrowRight} size={IconSize.Small} />
      </Link>
    </div>
  )
}

'use client'

import { FC } from 'react'
import styles from './Spinner.module.scss'

interface SpinnerProps {
  /**
   * Размер спиннера
   */
  size?: 'default' | 'small'

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

/**
 * Компонент спиннера для состояния загрузки
 */
export const Spinner: FC<SpinnerProps> = ({
  size = 'default',
  className = '',
}) => {
  return (
    <span
      className={`${styles.spinner} ${styles[`spinner--${size}`]} ${className}`.trim()}
      role="status"
      aria-label="Загрузка"
    >
      <span className={styles.spinner__circle} />
    </span>
  )
}

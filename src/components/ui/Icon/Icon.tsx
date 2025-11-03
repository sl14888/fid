'use client'

import { FC, lazy, Suspense } from 'react'
import clsx from 'clsx'
import type { IconProps } from './Icon.types'
import { IconName } from './Icon.types'
import styles from './Icon.module.scss'

// Вспомогательная функция для конвертации kebab-case в формат имен файлов
// Например: 'arrow-down' -> 'Arrow_down', 'eye-close' -> 'Eye_close'
const toPascalCase = (str: string): string => {
  const parts = str.split('-')
  // Первая часть с заглавной буквы, остальные со строчной
  return parts
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join('_')
}

// Вспомогательная функция для определения какой SVG файл загрузить
const getIconFileName = (
  name: (typeof IconName)[keyof typeof IconName],
  size: 'small' | 'medium' | 'large'
): string => {
  const baseName = toPascalCase(name)

  // Для маленького размера пробуем суффикс _small
  if (size === 'small') {
    return `${baseName}_small.svg`
  }

  // Для среднего и большого размера пробуем суффикс _large
  return `${baseName}_large.svg`
}

// Запасная функция для загрузки иконки без суффикса
const getFallbackFileName = (
  name: (typeof IconName)[keyof typeof IconName]
): string => {
  const baseName = toPascalCase(name)
  return `${baseName}.svg`
}

// Динамический загрузчик иконок с обработкой ошибок
const loadIcon = (
  name: (typeof IconName)[keyof typeof IconName],
  size: 'small' | 'medium' | 'large'
) => {
  const fileName = getIconFileName(name, size)

  return lazy(async () => {
    try {
      // Пробуем загрузить с суффиксом размера
      return await import(`./assets/${fileName}`)
    } catch (error) {
      try {
        // Запасной вариант: файл без суффикса
        const fallbackFile = getFallbackFileName(name)
        return await import(`./assets/${fallbackFile}`)
      } catch (fallbackError) {
        console.error(`Icon "${name}" not found`)
        // Возвращаем пустой SVG как запасной вариант
        return {
          default: () => (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" fill="transparent" />
            </svg>
          ),
        }
      }
    }
  })
}

// Маппинг размера на пиксели
const sizeMap = {
  small: 16,
  medium: 20,
  large: 24,
}

export const Icon: FC<IconProps> = ({
  name,
  size = 'medium',
  color = '#6E6E6E',
  className,
  'aria-label': ariaLabel,
  style,
  ...props
}) => {
  const IconComponent = loadIcon(name, size)
  const pixelSize = sizeMap[size]

  // Объединяем style с цветом
  const iconStyle = {
    ...style,
    ...(color && { color }),
  }

  return (
    <Suspense
      fallback={
        <span
          className={clsx(styles.icon, styles[`icon--${size}`], className)}
          style={{ width: pixelSize, height: pixelSize, ...iconStyle }}
        />
      }
    >
      <IconComponent
        className={clsx(styles.icon, styles[`icon--${size}`], className)}
        width={pixelSize}
        height={pixelSize}
        style={iconStyle}
        aria-label={ariaLabel || name}
        role={ariaLabel ? 'img' : 'presentation'}
        {...props}
      />
    </Suspense>
  )
}

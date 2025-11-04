import { FC, createElement } from 'react'
import {
  TypographyProps,
  AliasTypographyProps,
  variantClassMap,
  variantTagMap,
} from './Typography.types'
import styles from './Typography.module.scss'

/**
 * Универсальный компонент типографики
 * Поддерживает все типографические стили из дизайн-системы
 */
export const Typography: FC<TypographyProps> = ({
  variant,
  children,
  className = '',
  tag,
  color,
  style,
  ...rest
}) => {
  // Определяем тег: используем переданный или дефолтный для данного варианта
  const Tag = tag || variantTagMap[variant]

  // Собираем классы
  const combinedClassName =
    `${styles.typography} ${styles[variantClassMap[variant]]} ${className}`.trim()

  // Добавляем цвет в inline стили если передан
  const combinedStyle = color ? { ...style, color } : style

  return createElement(
    Tag,
    {
      className: combinedClassName,
      style: combinedStyle,
      ...rest,
    },
    children
  )
}

// ============================================
// АЛИАСЫ-КОМПОНЕНТЫ (заголовки)
// ============================================

export const Heading1: FC<AliasTypographyProps> = (props) => (
  <Typography variant="h1" {...props} />
)

export const Heading2: FC<AliasTypographyProps> = (props) => (
  <Typography variant="h2" {...props} />
)

export const Heading3: FC<AliasTypographyProps> = (props) => (
  <Typography variant="h3" {...props} />
)

export const Heading4: FC<AliasTypographyProps> = (props) => (
  <Typography variant="h4" {...props} />
)

export const Heading5: FC<AliasTypographyProps> = (props) => (
  <Typography variant="h5" {...props} />
)

// ============================================
// АЛИАСЫ-КОМПОНЕНТЫ (текстовые стили)
// ============================================

export const TextLRegular: FC<AliasTypographyProps> = (props) => (
  <Typography variant="textLRegular" {...props} />
)

export const TextLMedium: FC<AliasTypographyProps> = (props) => (
  <Typography variant="textLMedium" {...props} />
)

export const TextMRegular: FC<AliasTypographyProps> = (props) => (
  <Typography variant="textMRegular" {...props} />
)

export const TextMMedium: FC<AliasTypographyProps> = (props) => (
  <Typography variant="textMMedium" {...props} />
)

export const TextS: FC<AliasTypographyProps> = (props) => (
  <Typography variant="textS" {...props} />
)

export const TextXS: FC<AliasTypographyProps> = (props) => (
  <Typography variant="textXs" {...props} />
)

// ============================================
// АЛИАСЫ-КОМПОНЕНТЫ (метки)
// ============================================

export const LabelM: FC<AliasTypographyProps> = (props) => (
  <Typography variant="labelM" {...props} />
)

export const LabelS: FC<AliasTypographyProps> = (props) => (
  <Typography variant="labelS" {...props} />
)

export const LabelXS: FC<AliasTypographyProps> = (props) => (
  <Typography variant="labelXs" {...props} />
)

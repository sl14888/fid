'use client'

import { FC } from 'react'
import clsx from 'clsx'
import type { IconProps } from './Icon.types'

// Импорт всех иконок
import ArrowDownLarge from './assets/Arrow_down_large.svg'
import ArrowDownSmall from './assets/Arrow_down_small.svg'
import ArrowLeftLarge from './assets/Arrow_left_large.svg'
import ArrowLeftSmall from './assets/Arrow_left_small.svg'
import ArrowRightLarge from './assets/Arrow_right_large.svg'
import ArrowRightSmall from './assets/Arrow_right_small.svg'
import ArrowUpLarge from './assets/Arrow_up_large.svg'
import ArrowUpSmall from './assets/Arrow_up_small.svg'
import CrossLarge from './assets/Cross_large.svg'
import CrossSmall from './assets/Cross_small.svg'
import CrossFillLarge from './assets/Cross_fill_large.svg'
import CrossFillSmall from './assets/Cross_fill_small.svg'
import EarthLarge from './assets/Earth_large.svg'
import EarthSmall from './assets/Earth_small.svg'
import EyeCloseLarge from './assets/Eye_close_large.svg'
import EyeCloseSmall from './assets/Eye_close_small.svg'
import EyeOpenLarge from './assets/Eye_open_large.svg'
import EyeOpenSmall from './assets/Eye_open_small.svg'
import House from './assets/House.svg'
import ListLarge from './assets/List_large.svg'
import ListSmall from './assets/List_small.svg'
import MinusLarge from './assets/Minus_large.svg'
import MinusSmall from './assets/Minus_small.svg'
import PersonLarge from './assets/Person.svg'
import PersonSmall from './assets/Person.svg'
import PersonOutlineLarge from './assets/Person_outline_large.svg'
import PersonOutlineSmall from './assets/Person_outline_small.svg'
import PlusLarge from './assets/Plus_large.svg'
import PlusSmall from './assets/Plus_small.svg'
import ReviewLarge from './assets/Review_large.svg'
import ReviewSmall from './assets/Review_small.svg'
import ReviewStarLarge from './assets/Review_star_large.svg'
import ReviewStarSmall from './assets/Review_star_small.svg'
import SearchLarge from './assets/Search_large.svg'
import SearchSmall from './assets/Search_small.svg'
import StarLarge from './assets/Star_large.svg'
import StarSmall from './assets/Star_small.svg'
import SwooshLarge from './assets/Swoosh_large.svg'
import SwooshSmall from './assets/Swoosh_small.svg'

import styles from './Icon.module.scss'

// Маппинг размера на пиксели
const sizeMap = {
  small: 16,
  medium: 20,
  large: 24,
}

// Карта иконок: name -> { large, small }
const iconMap = {
  'arrow-down': { large: ArrowDownLarge, small: ArrowDownSmall },
  'arrow-left': { large: ArrowLeftLarge, small: ArrowLeftSmall },
  'arrow-right': { large: ArrowRightLarge, small: ArrowRightSmall },
  'arrow-up': { large: ArrowUpLarge, small: ArrowUpSmall },
  cross: { large: CrossLarge, small: CrossSmall },
  'cross-fill': { large: CrossFillLarge, small: CrossFillSmall },
  earth: { large: EarthLarge, small: EarthSmall },
  'eye-close': { large: EyeCloseLarge, small: EyeCloseSmall },
  'eye-open': { large: EyeOpenLarge, small: EyeOpenSmall },
  house: { large: House, small: House }, // House без размера
  list: { large: ListLarge, small: ListSmall },
  minus: { large: MinusLarge, small: MinusSmall },
  person: { large: PersonLarge, small: PersonSmall },
  'person-outline': { large: PersonOutlineLarge, small: PersonOutlineSmall },
  plus: { large: PlusLarge, small: PlusSmall },
  review: { large: ReviewLarge, small: ReviewSmall },
  'review-star': { large: ReviewStarLarge, small: ReviewStarSmall },
  search: { large: SearchLarge, small: SearchSmall },
  star: { large: StarLarge, small: StarSmall },
  swoosh: { large: SwooshLarge, small: SwooshSmall },
} as const

export const Icon: FC<IconProps> = ({
  name,
  size = 'large',
  color = 'inherit',
  className,
  'aria-label': ariaLabel,
  style,
  ...props
}) => {
  const pixelSize = sizeMap[size]

  // Получаем нужный компонент иконки
  const iconVariant = iconMap[name]
  if (!iconVariant) {
    console.error(`Icon "${name}" not found`)
    return null
  }

  // Для small размера используем small вариант, для medium и large - large
  const IconComponent = size === 'small' ? iconVariant.small : iconVariant.large

  // Объединяем style с цветом
  const iconStyle = {
    ...style,
    ...(color && { color }),
  }

  return (
    <IconComponent
      className={clsx(styles.icon, styles[`icon--${size}`], className)}
      width={pixelSize}
      height={pixelSize}
      style={iconStyle}
      aria-label={ariaLabel || name}
      role={ariaLabel ? 'img' : 'presentation'}
      {...props}
    />
  )
}

'use client'

import clsx from 'clsx'
import { LogoProps } from './Logo.types'
import LogoSvg from './img/Logo.svg'
import styles from './Logo.module.scss'

export const Logo = ({
  width,
  height,
  className,
  ...props
}: LogoProps) => {
  return (
    <LogoSvg
      className={clsx(styles.logo, className)}
      width={width}
      height={height}
      {...props}
    />
  )
}

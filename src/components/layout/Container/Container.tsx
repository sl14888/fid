'use client'

import { createElement } from 'react'
import clsx from 'clsx'
import { ContainerProps } from './Container.types'

import styles from './Container.module.scss'

export const Container = ({
  children,
  className,
  noPadding = false,
  as = 'div',
  ...props
}: ContainerProps) => {
  return createElement(
    as,
    {
      className: clsx(
        styles.container,
        {
          [styles['container--noPadding']]: noPadding,
        },
        className
      ),
      ...props,
    },
    children
  )
}

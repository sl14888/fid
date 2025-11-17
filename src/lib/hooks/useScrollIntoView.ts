'use client'

import { useCallback, RefObject } from 'react'

interface UseScrollIntoViewOptions {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  inline?: ScrollLogicalPosition
}

/**
 * Хук для скролла к элементу
 * @param ref - ref элемента к которому нужно скроллить
 * @param options - опции скролла
 */
export const useScrollIntoView = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseScrollIntoViewOptions = {}
) => {
  const { behavior = 'smooth', block = 'start', inline = 'nearest' } = options

  const scrollIntoView = useCallback(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior,
        block,
        inline,
      })
    }
  }, [ref, behavior, block, inline])

  return scrollIntoView
}

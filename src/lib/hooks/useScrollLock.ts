import { useEffect, useRef } from 'react'

let scrollLockCount = 0
let originalBodyStyles: {
  overflow: string
  paddingRight: string
} | null = null
let originalHtmlStyles: {
  overflow: string
} | null = null

export const useScrollLock = (isLocked: boolean): void => {
  const isLockedRef = useRef(isLocked)

  useEffect(() => {
    isLockedRef.current = isLocked
  }, [isLocked])

  useEffect(() => {
    if (!isLocked) return

    scrollLockCount++

    if (scrollLockCount === 1) {
      const html = document.documentElement
      const body = document.body

      const scrollbarWidth = window.innerWidth - html.clientWidth

      originalHtmlStyles = {
        overflow: html.style.overflow,
      }

      originalBodyStyles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      }

      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      if (!isLockedRef.current) return

      scrollLockCount--

      if (scrollLockCount === 0) {
        const html = document.documentElement
        const body = document.body

        if (originalHtmlStyles) {
          html.style.overflow = originalHtmlStyles.overflow
          originalHtmlStyles = null
        }

        if (originalBodyStyles) {
          body.style.overflow = originalBodyStyles.overflow
          body.style.paddingRight = originalBodyStyles.paddingRight
          originalBodyStyles = null
        }
      }
    }
  }, [isLocked])
}

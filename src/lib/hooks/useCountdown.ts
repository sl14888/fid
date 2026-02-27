'use client'

import { useState, useRef, useCallback } from 'react'

export const useCountdown = (seconds: number) => {
  const [remaining, setRemaining] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setRemaining(seconds)

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [seconds])

  const isActive = remaining > 0

  return { remaining, isActive, start }
}

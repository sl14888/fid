'use client'

import { TopLoaderProvider } from '@/components/providers/TopLoaderProvider'
import { Toast } from '../Toast'

export const GlobalWidgets = () => {
  return (
    <>
      <TopLoaderProvider />
      <Toast />
    </>
  )
}

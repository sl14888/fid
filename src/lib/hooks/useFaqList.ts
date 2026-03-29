'use client'

import { useEffect, useMemo } from 'react'
import { useFaqStore } from '@/store/faq.store'
import type { AccordionItem } from '@/components/ui/Accordion'

interface UseFaqListReturn {
  items: AccordionItem[]
  isLoading: boolean
  isFetched: boolean
  error: string | null
  firstItemId: string | null
}

export const useFaqList = (): UseFaqListReturn => {
  const { items, isLoading, isFetched, error, fetchFaqItems } = useFaqStore()

  useEffect(() => {
    if (!isFetched) {
      fetchFaqItems()
    }
  }, [isFetched, fetchFaqItems])

  const accordionItems: AccordionItem[] = useMemo(
    () =>
      [...items]
        .sort((a, b) => a.text.priority - b.text.priority)
        .map((item, index) => ({
          id: String(index),
          title: item.text.question,
          content: item.text.answer,
        })),
    [items]
  )

  const firstItemId = accordionItems.length > 0 ? accordionItems[0].id : null

  return { items: accordionItems, isLoading, isFetched, error, firstItemId }
}

'use client'

import { Container } from '@/components/layout/Container'
import { Accordion } from '@/components/ui/Accordion'
import { useFaqList } from '@/lib/hooks/useFaqList'

import styles from './BusinessFaq.module.scss'

export const BusinessFaq = () => {
  const { items, isLoading, firstItemId } = useFaqList()

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.card}>
          {isLoading ? (
            <div className={styles.skeleton} />
          ) : (
            <Accordion
              items={items}
              defaultOpenId={firstItemId ?? undefined}
            />
          )}
        </div>
      </Container>
    </section>
  )
}

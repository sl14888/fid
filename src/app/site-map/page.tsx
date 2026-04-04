import type { Metadata } from 'next'
import Link from 'next/link'
import { serverFetchAllCompanies } from '@/lib/api/server-fetch'
import styles from './page.module.scss'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Карта сайта',
  description: 'Карта сайта FID — все страницы платформы для отзывов о компаниях.',
  alternates: { canonical: '/site-map' },
}

const STATIC_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/companies', label: 'Все компании' },
  { href: '/for-business', label: 'FID для бизнеса' },
  { href: '/about-service', label: 'Правила сервиса' },
  { href: '/privacy', label: 'Политика конфиденциальности' },
  { href: '/terms', label: 'Пользовательское соглашение' },
]

export default async function SitemapPage() {
  const companies = await serverFetchAllCompanies()

  return (
    <main className={styles.sitemapPage}>
      <h1 className={styles.sitemapPage__title}>Карта сайта</h1>

      <section className={styles.sitemapPage__section}>
        <h2 className={styles.sitemapPage__sectionTitle}>Основные страницы</h2>
        <ul className={styles.sitemapPage__list}>
          {STATIC_LINKS.map((link) => (
            <li key={link.href} className={styles.sitemapPage__item}>
              <Link href={link.href} className={styles.sitemapPage__link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {companies.length > 0 && (
        <section className={styles.sitemapPage__section}>
          <h2 className={styles.sitemapPage__sectionTitle}>
            Компании ({companies.length})
          </h2>
          <ul className={styles.sitemapPage__list}>
            {companies.map((company) => (
              <li key={company.id} className={styles.sitemapPage__item}>
                <Link
                  href={`/companies/${company.id}`}
                  className={styles.sitemapPage__link}
                >
                  {company.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

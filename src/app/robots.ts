import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/api'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/companies',
          '/companies/',
          '/reviews/',
          '/for-business',
          '/about-service',
          '/privacy',
          '/terms',
          '/site-map',
        ],
        disallow: [
          '/api/',
          '/reviews/new',
          '/reviews/*/edit',
          '/profile',
          '/register',
          '/users',
          '/?*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

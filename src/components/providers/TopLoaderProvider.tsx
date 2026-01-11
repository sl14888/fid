'use client'

import NextTopLoader from 'nextjs-toploader'

export const TopLoaderProvider = () => {
  return (
    <NextTopLoader
      color="#4583ff"
      height={3}
      showSpinner={false}
      easing="ease"
      crawl={false}
      showForHashAnchor={false}
      speed={400}
    />
  )
}

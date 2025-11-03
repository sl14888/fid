import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Настройка Turbopack для обработки SVG через SVGR
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true, // Убирает width/height из SVG для гибкости
            },
          },
        ],
        as: '*.js', // КРИТИЧНО! Обрабатываем SVG как JS модули
      },
    },
  },
}

export default nextConfig

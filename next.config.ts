import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // TODO: Выпилить после того, как бэк исправит проблему с обязательным слешем
  // Отключаем автоматическое удаление trailing slash
  skipTrailingSlashRedirect: true,

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

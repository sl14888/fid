import { IconName } from '@/components/ui/Icon'
import { lazy } from 'react'

// Вспомогательная функция для конвертации kebab-case в формат имен файлов
// Например: 'arrow-down' -> 'Arrow_down', 'eye-close' -> 'Eye_close'
const toPascalCase = (str: string): string => {
  if (!str || typeof str !== 'string') {
    console.error('toPascalCase: invalid input', str)
    return ''
  }
  const parts = str.split('-')
  // Первая часть с заглавной буквы, остальные со строчной
  return parts
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join('_')
}

// Вспомогательная функция для определения какой SVG файл загрузить
const getIconFileName = (
  name: (typeof IconName)[keyof typeof IconName],
  size: 'small' | 'medium' | 'large'
): string => {
  const baseName = toPascalCase(name)

  // Для маленького размера пробуем суффикс _small
  if (size === 'small') {
    return `${baseName}_small.svg`
  }

  // Для среднего и большого размера пробуем суффикс _large
  return `${baseName}_large.svg`
}

// Запасная функция для загрузки иконки без суффикса
const getFallbackFileName = (
  name: (typeof IconName)[keyof typeof IconName]
): string => {
  const baseName = toPascalCase(name)
  return `${baseName}.svg`
}

// Динамический загрузчик иконок с обработкой ошибок
export const loadIcon = (
  name: (typeof IconName)[keyof typeof IconName],
  size: 'small' | 'medium' | 'large'
) => {
  const fileName = getIconFileName(name, size)

  return lazy(async () => {
    try {
      // Пробуем загрузить с суффиксом размера
      return await import(`../../components/ui/Icon/assets/${fileName}`)
    } catch (error) {
      try {
        // Запасной вариант: файл без суффикса
        const fallbackFile = getFallbackFileName(name)
        return await import(`../../components/ui/Icon/assets/${fallbackFile}`)
      } catch (fallbackError) {
        console.error(`Icon "${name}" not found`)
        // Возвращаем пустой SVG как запасной вариант
        return {
          default: () => (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" fill="transparent" />
            </svg>
          ),
        }
      }
    }
  })
}

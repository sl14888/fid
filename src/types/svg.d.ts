// TypeScript декларация для импорта SVG файлов
// Позволяет импортировать .svg файлы как React компоненты

declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGSVGElement>>
  export default content
}

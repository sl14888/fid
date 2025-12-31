export const getInitials = (name?: string | null): string => {
  if (!name) return '?'

  const trimmed = name.trim()
  if (!trimmed) return '?'

  const words = trimmed.split(/\s+/)

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  return trimmed.substring(0, 2).toUpperCase()
}

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

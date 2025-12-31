import {
  AVATAR_VALIDATION_RULES,
  PHOTO_VALIDATION_RULES,
  PHOTO_UPLOAD_LIMITS,
  type FileValidationResult,
} from '@/types/file.types'

/**
 * Валидация файла аватара
 */
export const validateAvatarFile = (file: File): FileValidationResult => {
  const { maxSizeMB, allowedTypes } = AVATAR_VALIDATION_RULES

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Допустимы только изображения (JPEG, PNG, WebP)',
    }
  }

  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Размер файла не должен превышать ${maxSizeMB} МБ (текущий: ${formatFileSize(file.size)})`,
    }
  }

  return { valid: true }
}

/**
 * Форматирование размера файла в читаемый вид
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Байт'

  const k = 1024
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Чтение файла как Data URL для превью
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Не удалось прочитать файл'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Валидация файла фотографии для отзыва
 */
export const validatePhotoFile = (file: File): FileValidationResult => {
  const { maxSizeMB, allowedTypes } = PHOTO_VALIDATION_RULES

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Допустимы только изображения (JPEG, PNG, WebP)',
    }
  }

  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Размер файла не должен превышать ${maxSizeMB} МБ (текущий: ${formatFileSize(file.size)})`,
    }
  }

  return { valid: true }
}

/**
 * Валидация списка файлов для загрузки
 */
export const validatePhotosList = (
  files: File[],
  currentCount: number
): FileValidationResult => {
  if (files.length + currentCount > PHOTO_UPLOAD_LIMITS.MAX_PHOTOS) {
    return {
      valid: false,
      error: `Можно загрузить максимум ${PHOTO_UPLOAD_LIMITS.MAX_PHOTOS} фотографий`,
    }
  }

  for (const file of files) {
    const validation = validatePhotoFile(file)
    if (!validation.valid) {
      return validation
    }
  }

  return { valid: true }
}

/**
 * Конвертация FileList в массив File
 */
export const fileListToArray = (fileList: FileList | null): File[] => {
  if (!fileList) return []
  return Array.from(fileList)
}

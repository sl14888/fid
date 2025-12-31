export interface FileValidationResult {
  valid: boolean
  error?: string
}

export interface FileValidationRules {
  maxSizeMB: number
  allowedTypes: string[]
  minWidth?: number
  minHeight?: number
}

export const AVATAR_VALIDATION_RULES: FileValidationRules = {
  maxSizeMB: 2,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
}

export interface UploadedPhoto {
  id: number
  url: string
  isUploading?: boolean
}

export interface FileDto {
  id: number
  url: string
}

export interface FileUrlDto {
  url: string
}

export const PHOTO_VALIDATION_RULES: FileValidationRules = {
  maxSizeMB: 2,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
}

export const PHOTO_UPLOAD_LIMITS = {
  MAX_PHOTOS: 20,
} as const

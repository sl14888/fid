export type DropdownOption = {
  value: string | number
  label: string
  disabled?: boolean
}

export type DropdownVariant = 'label' | 'input'

export const DropdownSize = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
} as const

export type DropdownProps = {
  triggerText: string
  title?: string
  options: DropdownOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
  noOptionsText?: string
  onOpen?: () => void
  onClose?: () => void
  variant?: DropdownVariant
  placeholder?: string
  // Пропсы для input варианта
  size?: (typeof DropdownSize)[keyof typeof DropdownSize]
  label?: string
  error?: string
  helperText?: string
  fluid?: boolean
  required?: boolean
  hideHelperTextArea?: boolean
}

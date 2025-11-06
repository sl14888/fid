export type DropdownOption = {
  value: string | number
  label: string
  disabled?: boolean
}

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
}

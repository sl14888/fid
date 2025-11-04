import { InputProps } from '@/components/ui/Input'

/**
 * Пропсы для PasswordInput
 * Нет дополнительных пропсов - только toggle видимости пароля
 */
export type PasswordInputProps = Omit<InputProps, 'type' | 'rightElement'>

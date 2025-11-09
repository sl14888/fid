'use client'

import { forwardRef, useState, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/Input'
import { Icon, IconName } from '@/components/ui/Icon'
import { PasswordInputProps } from './PasswordInput.types'
import styles from './PasswordInput.module.scss'

/**
 * Компонент ввода пароля с toggle видимости
 *
 * Валидация пароля должна выполняться через Zod схемы в формах.
 *
 * @example
 * // С react-hook-form и Zod валидацией
 * const schema = z.object({
 *   password: z.string()
 *     .min(12, 'Минимум 12 символов')
 *     .regex(/[A-Za-z]/, 'Должен содержать буквы')
 *     .regex(/[0-9]/, 'Должен содержать цифры')
 *     .regex(/^[^#$%]*$/, 'Не должен содержать #, $, %')
 * })
 *
 * <PasswordInput
 *   label="Пароль"
 *   {...register('password')}
 *   error={errors.password?.message}
 *   helperText="От 12 символов: A-z, 1-9. Кроме: #,$,%"
 * />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev)
    }, [])

    // Рендерим кнопку с обеими иконками, переключаем видимость через CSS
    const rightElement = useMemo(
      () => (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
          tabIndex={-1}
          className={styles.toggleButton}
        >
          <Icon
            name={IconName.EyeClose}
            className={`${styles.eyeIcon} ${isPasswordVisible ? styles.hidden : ''}`}
          />
          <Icon
            name={IconName.EyeOpen}
            className={`${styles.eyeIcon} ${!isPasswordVisible ? styles.hidden : ''}`}
          />
        </button>
      ),
      [isPasswordVisible, togglePasswordVisibility]
    )

    return (
      <Input
        ref={ref}
        type={isPasswordVisible ? 'text' : 'password'}
        rightElement={rightElement}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

import { ReactElement } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

/**
 * Пропсы для FormField компонента
 */
export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /**
   * Имя поля в форме
   */
  name: TName

  /**
   * Control объект из useForm
   */
  control: Control<TFieldValues>

  /**
   * Дочерний элемент - input компонент (Input, TextArea, PasswordInput, SearchInput)
   */
  children: ReactElement

  /**
   * Дополнительный CSS класс
   */
  className?: string
}

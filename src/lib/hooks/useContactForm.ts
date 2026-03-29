import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact.schema'
import { useContactStore } from '@/store'
import { useCountdown } from './useCountdown'

const DEFAULT_VALUES: ContactFormData = {
  contact: '',
  message: '',
}

export const useContactForm = (onSuccess: () => void) => {
  const { isLoading, sendMessage } = useContactStore()
  const { isActive: isCooldown, remaining: cooldownRemaining, start: startCooldown } = useCountdown(60)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const contactValue = useWatch({ control, name: 'contact' })
  const isSubmitDisabled = !contactValue.trim() || isLoading || isCooldown

  const onSubmit = handleSubmit(async (data) => {
    const success = await sendMessage({
      contact: data.contact,
      message: data.message ?? '',
    })
    if (success) {
      startCooldown()
      onSuccess()
    }
  })

  const resetForm = () => reset(DEFAULT_VALUES)

  return {
    control,
    errors,
    isLoading,
    isSubmitDisabled,
    isCooldown,
    cooldownRemaining,
    onSubmit,
    resetForm,
  }
}

import toast from 'react-hot-toast'

export const showToast = {
  success: (message: string, duration?: number) => {
    return toast.success(message, { duration })
  },

  error: (message: string, duration?: number) => {
    return toast.error(message, { duration })
  },

  warning: (message: string, duration?: number) => {
    return toast(message, {
      icon: '⚠️',
      duration: duration ?? 4000,
    })
  },

  info: (message: string, duration?: number) => {
    return toast(message, {
      icon: 'ℹ️',
      duration: duration ?? 3000,
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
    })
  },

  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId)
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  },
}

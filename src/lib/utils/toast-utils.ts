import toast, { useToasterStore } from 'react-hot-toast'
import { useEffect } from 'react'

const MAX_TOASTS = 3

const toastQueue: string[] = []

const limitToasts = (newToastId: string) => {
  toastQueue.push(newToastId)

  if (toastQueue.length > MAX_TOASTS) {
    const oldestId = toastQueue.shift()
    if (oldestId) {
      toast.dismiss(oldestId)
    }
  }
}

const removeFromQueue = (toastId: string) => {
  const index = toastQueue.indexOf(toastId)
  if (index > -1) {
    toastQueue.splice(index, 1)
  }
}

export const showToast = {
  success: (message: string, duration?: number) => {
    const id = toast.success(message, { duration })
    limitToasts(id)
    return id
  },

  error: (message: string, duration?: number) => {
    const id = toast.error(message, { duration })
    limitToasts(id)
    return id
  },

  warning: (message: string, duration?: number) => {
    const id = toast(message, {
      icon: '⚠️',
      duration: duration ?? 4000,
    })
    limitToasts(id)
    return id
  },

  info: (message: string, duration?: number) => {
    const id = toast(message, {
      icon: 'ℹ️',
      duration: duration ?? 3000,
    })
    limitToasts(id)
    return id
  },

  loading: (message: string) => {
    const id = toast.loading(message, {
      duration: Infinity,
    })
    limitToasts(id)
    return id
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      removeFromQueue(toastId)
    } else {
      toastQueue.length = 0
    }
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

export const useToastLimit = () => {
  const { toasts } = useToasterStore()

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .slice(MAX_TOASTS)
      .forEach((t) => toast.dismiss(t.id))
  }, [toasts])
}

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'

/**
 * Хук для управления модалкой авторизации
 * Автоматически открывает модалку если в URL есть ?auth=required
 */
export const useAuthModal = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  useEffect(() => {
    const authRequired = searchParams.get('auth')

    console.log('[useAuthModal] Effect triggered:', {
      authRequired,
      isAuthenticated,
      isInitializing,
      searchParamsString: searchParams.toString(),
    })

    // Не блокируем открытие модалки проверкой isInitializing
    // Модалка должна открыться сразу при наличии параметра
    if (authRequired === 'required' && !isAuthenticated) {
      console.log('[useAuthModal] Opening modal...')

      // ВАЖНО: открываем модалку ПЕРЕД удалением параметра из URL
      // Иначе React ре-рендерит после router.replace и useEffect не увидит параметр
      // eslint-disable-next-line react-hooks/set-state-in-effect -- необходимо для синхронизации с router.replace
      setIsOpen(true)
      toast.error('Необходима авторизация. Пожалуйста, войдите в систему')

      // Удаляем параметр из URL после открытия модалки
      const params = new URLSearchParams(searchParams.toString())
      params.delete('auth')

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname

      console.log('[useAuthModal] Removing auth param, new URL:', newUrl)
      router.replace(newUrl)
    }
  }, [searchParams, isAuthenticated, isInitializing, router])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

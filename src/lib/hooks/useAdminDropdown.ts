import { useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/store/auth.store'
import { ADMIN_DROPDOWN_OPTIONS } from '@/constants/navigation'
import { Role } from '@/types/common.types'
import type { DropdownOption } from '@/components/ui/Dropdown/Dropdown.types'

export const useAdminDropdown = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const isAdmin = user?.role === Role.ADMIN

  const options: DropdownOption[] = useMemo(
    () =>
      ADMIN_DROPDOWN_OPTIONS.map((link) => ({
        value: link.href,
        label: link.label,
      })),
    []
  )

  const handleSelect = useCallback(
    (value: string | number) => {
      router.push(String(value))
      setIsBottomSheetOpen(false)
    },
    [router]
  )

  const openBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(true)
  }, [])

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false)
  }, [])

  return {
    isAdmin,
    options,
    handleSelect,
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
  }
}

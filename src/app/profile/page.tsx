'use client'

import { useRouter } from 'next/navigation'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Heading2, TextLRegular } from '@/components/ui/Typography'
import { useAuthStore } from '@/store/auth.store'
import styles from './profile.module.scss'
import { useEffect } from 'react'
import { scrollIntoView } from '@/lib/utils/scrolling-utils'
import { useCompaniesStore, useFeedbacksStore } from '@/store'
import { SortOrder, SortType } from '@/types/request.types'

/**
 * Страница профиля пользователя
 * Защищена middleware - доступна только авторизованным пользователям
 */
export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { fetchTopCompanies, sortCompanies, createCompany } =
    useCompaniesStore()
  const { createFeedback } = useFeedbacksStore()

  useEffect(() => {
    scrollIntoView()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleTest = () => {
    // sortCompanies({
    //   sortType: SortType.RATING,
    //   page: 1,
    //   size: 7,
    //   sortOrder: SortOrder.DESC,
    // })
    // fetchTopCompanies()
    if (user) {
      // createFeedback({
      //   companyId: 2,
      //   pluses: 'плюсы плюсы плюсы плюсы плюсы плюсы плюсы плюсы плюсы плюсы ',
      //   minuses: 'минусы минусы минусы минусы минусы минусы минусы минусы ',
      //   description:
      //     'описание описание описание описание описание описание описание описание описание описание описание описание ',
      //   grade: 4,
      //   userEmail: user.email,
      // })
      createCompany({
        name: 'Компания $2',
        employmentType: 1,
        website: 'https://google.com',
        address: 'Адрес',
        inn: 373638473636,
        feedback: {
          pluses:
            'плюсы плюсы плюсы плюсы плюсы плюсы плюсы плюсы плюсы плюсы ',
          minuses: 'минусы минусы минусы минусы минусы минусы минусы минусы ',
          description:
            'описание описание описание описание описание описание описание описание описание описание описание описание ',
          grade: 2,
          userEmail: user.email,
        },
      })
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className={styles.profilePage}>
      <div>
        <Heading2>Профиль пользователя</Heading2>

        <Button onClick={handleTest}>Тест</Button>

        {user.name && (
          <div className={styles.infoRow}>
            <TextLRegular color="var(--color-gray-500)">Имя:</TextLRegular>
            <TextLRegular>{user.name}</TextLRegular>
          </div>
        )}

        <TextLRegular color="var(--color-gray-500)">Email:</TextLRegular>
        <TextLRegular>{user.email}</TextLRegular>

        <TextLRegular color="var(--color-gray-500)">Роль:</TextLRegular>
        <TextLRegular>{user.role}</TextLRegular>

        <Button
          text="Выход"
          variant={ButtonVariant.PrimaryInverse}
          size={ButtonSize.Default}
          onClick={handleLogout}
          className={styles.logoutButton}
        />
      </div>
    </div>
  )
}

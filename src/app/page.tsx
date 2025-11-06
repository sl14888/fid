'use client'

import { useState } from 'react'
import { Badge, BadgeVariant } from '@/components/ui/Badge'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { SearchInput } from '@/components/ui/SearchInput'
import { Switch } from '@/components/ui/Switch'
import { TextArea } from '@/components/ui/TextArea'
import {
  Heading1,
  TextLMedium,
  TextLRegular,
  TextS,
} from '@/components/ui/Typography'
import { Rating, RatingSize } from '@/components/ui/Rating'
import { Pagination } from '@/components/ui/Pagination'
import { Avatar, AvatarSize, AvatarColor } from '@/components/ui/Avatar'
import { Dropdown } from '@/components/ui/Dropdown'
import { Layout } from '@/components/layout/Layout'

export default function Home() {
  const [isSwitch, setIsSwitch] = useState(false)
  const [rating1, setRating1] = useState(0)
  const [currentPage, setCurrentPage] = useState(7)

  const [selectedCountry, setSelectedCountry] = useState<string | number>('')
  const [selectedCity, setSelectedCity] = useState<string | number>('')

  return (
    <Layout>
      <section>
        <div>Тетовые иконки</div>
        <Icon name={IconName.ArrowDown} size={IconSize.Large} />
        <Icon name={IconName.List} size={IconSize.Small} color="blue" />
        <Icon name={IconName.PersonOutline} size={IconSize.Small} color="red" />
        <div>Тетовая типографика</div>
        <Heading1>Тест Heading 1</Heading1>
        <TextLRegular>Тест TextLRegular</TextLRegular>
        <TextLMedium>Тест TextLMedium</TextLMedium>
        <TextS>Тест TextS</TextS>
        <div>Тетовые кнопки</div>

        <div>
          <Button
            text="Кнопка Primary"
            variant={ButtonVariant.Primary}
            iconLeft={<Icon name={IconName.Earth} />}
          />
          <Button
            text="Кнопка SecondaryBlue"
            variant={ButtonVariant.PrimaryInverse}
            iconLeft={<Icon name={IconName.Earth} />}
          />
          <Button
            text="Кнопка PrimaryBlack маленькая "
            variant={ButtonVariant.PrimaryBlack}
            size={ButtonSize.Small}
            iconLeft={<Icon name={IconName.Earth} size={IconSize.Small} />}
          />
          <Button
            text="Кнопка SecondaryGray маленькая "
            variant={ButtonVariant.SecondaryGray}
            size={ButtonSize.Small}
            iconLeft={<Icon name={IconName.Earth} size={IconSize.Small} />}
          />

          <div>Тестовые инпуты</div>
          <div>
            <Input
              label="Email"
              type="email"
              helperText="Введите ваш email"
              error="Тестовая ошибка"
            />
            <PasswordInput
              label="Пароль"
              helperText="От 12 символов: A-z, 1-9. Кроме: #,$,%"
            />

            <SearchInput placeholder="Поиск компаний" />

            <TextArea
              label="Отзыв"
              maxLength={500}
              showCounter
              helperText="Напишите ваш отзыв"
            />
          </div>

          <div>Тестовые Switch</div>
          <Switch
            label="Включить уведомления"
            checked={isSwitch}
            onChange={() => setIsSwitch(!isSwitch)}
          />

          <div>Тестовые Badge</div>
          <Badge text="Primary" variant={BadgeVariant.Primary} />
        </div>

        <div>Badge с иконками</div>
        <Badge text="Text" variant={BadgeVariant.Info} />

        <div>Badge </div>
        <Badge text="Badge" variant={BadgeVariant.Primary} pill />

        <div>
          <div>Интерактивный рейтинг</div>
          <div>
            <Rating
              value={rating1}
              onChange={setRating1}
              size={RatingSize.Large}
            />
          </div>
        </div>

        <div>
          <div>Пагинация</div>
          <Pagination
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            visiblePages={4}
          />
        </div>

        <div style={{ marginTop: '40px' }}>
          <div>Аватар</div>
          <Avatar
            size={AvatarSize.XS}
            initials="ДК"
            color={AvatarColor.Primary}
          />
        </div>

        <div style={{ marginTop: '40px' }}>
          <div style={{ marginBottom: '20px' }}>Dropdown - базовый</div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Dropdown
              triggerText="Город"
              title="Выберите город"
              options={[
                { value: 'msk', label: 'Москва' },
                { value: 'spb', label: 'Санкт-Петербург' },
                { value: 'vvvv', label: 'Новосибирск' },
                { value: 'sadasdvvv', label: 'Екатеринбург' },
              ]}
              value={selectedCity}
              onChange={setSelectedCity}
            />

            <Dropdown
              triggerText="Филиал"
              title="Выберите филиал"
              options={[
                { value: 'hq', label: 'Головной офис' },
                { value: 'branch1', label: 'Филиал №1' },
                { value: 'branch2', label: 'Филиал №2' },
              ]}
              value={selectedCountry}
              onChange={setSelectedCountry}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}

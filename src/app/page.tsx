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

export default function Home() {
  const [isSwitch, setIsSwitch] = useState(false)
  const [rating1, setRating1] = useState(0)

  return (
    <div>
      <main>
        <section>
          <div>Тетовые иконки</div>
          <Icon name={IconName.ArrowDown} size={IconSize.Large} />
          <Icon name={IconName.List} size={IconSize.Small} color="blue" />
          <Icon
            name={IconName.PersonOutline}
            size={IconSize.Small}
            color="red"
          />
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
              variant={ButtonVariant.SecondaryBlue}
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
                error="Тестовая ошибка"
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

          <div style={{ marginTop: '40px' }}>
            Тестовый Rating (цвет меняется автоматически)
          </div>

          <div style={{ marginTop: '20px' }}>
            <div>
              Интерактивный рейтинг (попробуйте выбрать разное количество
              звезд):
            </div>
            <Rating
              value={rating1}
              onChange={setRating1}
              size={RatingSize.Large}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

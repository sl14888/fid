'use client'

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { SearchInput } from '@/components/ui/SearchInput'
import { TextArea } from '@/components/ui/TextArea'
import {
  Heading1,
  TextLMedium,
  TextLRegular,
  TextS,
} from '@/components/ui/Typography'

export default function Home() {
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
          </div>
        </section>
      </main>
    </div>
  )
}

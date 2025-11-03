'use client'

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
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
          <Icon name={IconName.List} size={IconSize.Small} color="black" />
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
              iconLeft={<Icon name={IconName.Earth} color="#fff" />}
            />
            <Button
              text="Кнопка SecondaryBlue"
              variant={ButtonVariant.SecondaryBlue}
              iconLeft={<Icon name={IconName.Earth} color="#4583ff" />}
            />
            <Button
              text="Кнопка PrimaryBlack маленькая "
              variant={ButtonVariant.PrimaryBlack}
              size={ButtonSize.Small}
              iconLeft={
                <Icon
                  name={IconName.Earth}
                  color="#fff"
                  size={IconSize.Small}
                />
              }
            />
            <Button
              text="Кнопка SecondaryGray маленькая "
              variant={ButtonVariant.SecondaryGray}
              size={ButtonSize.Small}
              iconLeft={
                <Icon
                  name={IconName.Earth}
                  color="#000"
                  size={IconSize.Small}
                />
              }
            />
          </div>
        </section>
      </main>
    </div>
  )
}

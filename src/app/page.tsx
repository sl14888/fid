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
          <TextLMedium>Тест TextLRegular</TextLMedium>
          <TextS>Тест TextS</TextS>
        </section>
      </main>
    </div>
  )
}

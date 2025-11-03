import { Icon, IconName, IconSize } from '@/components/ui/Icon'

export default function Home() {
  return (
    <div>
      <main>
        <section>
          <div>Тестовый текст</div>
          <Icon name={IconName.ArrowDown} size={IconSize.Large} />
        </section>
      </main>
    </div>
  )
}

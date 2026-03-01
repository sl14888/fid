import { ForBusinessHero } from './components/ForBusinessHero'
import { FeaturesSection } from './components/FeaturesSection'
import { StepsSection } from './components/StepsSection'
import { CtaSection } from './components/CtaSection'
import { FaqSection } from './components/FaqSection'

import styles from './page.module.scss'

export default function ForBusinessPage() {
  return (
    <div className={styles.page}>
      <ForBusinessHero />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
      <FaqSection />
    </div>
  )
}

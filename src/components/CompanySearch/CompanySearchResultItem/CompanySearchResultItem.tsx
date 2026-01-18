import { FC } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { AvatarSize } from '@/components/ui/Avatar/Avatar.types'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { TextLMedium, TextXS } from '@/components/ui/Typography'
import { CompanyWithCountFeedbacksDto } from '@/types/company.types'
import { getInitials } from '@/lib/utils/string'

import styles from './CompanySearchResultItem.module.scss'

interface CompanySearchResultItemProps {
  company: CompanyWithCountFeedbacksDto
  onSelect: (company: CompanyWithCountFeedbacksDto) => void
}

export const CompanySearchResultItem: FC<CompanySearchResultItemProps> = ({
  company,
  onSelect,
}) => {
  const handleSelect = () => {
    onSelect(company)
  }

  return (
    <div className={styles.item}>
      <div className={styles.item__content}>
        <Avatar
          size={AvatarSize.MD}
          alt={company.name}
          src={company.avatar.url}
          initials={getInitials(company.name)}
        />
        <div className={styles.item__info}>
          <TextLMedium className={styles.item__name}>
            {company.name}
          </TextLMedium>
          {company.employmentType?.description && (
            <TextXS className={styles.item__category}>
              {company.employmentType.description}
            </TextXS>
          )}
        </div>
      </div>
      <Button
        text="Выбрать"
        variant={ButtonVariant.SecondaryGray}
        size={ButtonSize.Small}
        onClick={handleSelect}
      />
    </div>
  )
}

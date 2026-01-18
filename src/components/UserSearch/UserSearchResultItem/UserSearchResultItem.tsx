import { FC } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { AvatarSize } from '@/components/ui/Avatar/Avatar.types'
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button'
import { TextLMedium, TextXS } from '@/components/ui/Typography'
import type { UserSearchResultDto } from '@/types/user.types'
import { getInitials } from '@/lib/utils/string'

import styles from './UserSearchResultItem.module.scss'

interface UserSearchResultItemProps {
  user: UserSearchResultDto
  onSelect: (user: UserSearchResultDto) => void
}

export const UserSearchResultItem: FC<UserSearchResultItemProps> = ({
  user,
  onSelect,
}) => {
  const handleSelect = () => {
    onSelect(user)
  }

  return (
    <div className={styles.item}>
      <div className={styles.item__content}>
        <Avatar
          size={AvatarSize.MD}
          alt={user.name}
          src={user.avatar || undefined}
          initials={getInitials(user.name)}
        />
        <div className={styles.item__info}>
          <TextLMedium className={styles.item__name}>{user.name}</TextLMedium>
          <TextXS className={styles.item__email}>{user.mail}</TextXS>
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

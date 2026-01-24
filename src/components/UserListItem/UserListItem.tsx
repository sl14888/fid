'use client'

import { FC } from 'react'
import clsx from 'clsx'

import { Avatar, AvatarSize } from '@/components/ui/Avatar'
import { Icon, IconName, IconSize } from '@/components/ui/Icon'
import { Heading5, TextS, TextMRegular } from '@/components/ui/Typography'
import { getInitials } from '@/lib/utils/string'

import { UserListItemSkeleton } from './UserListItemSkeleton'
import { UserListItemProps } from './UserListItem.types'

import styles from './UserListItem.module.scss'

export const UserListItem: FC<UserListItemProps> = ({
  id,
  name,
  email,
  countFeedbacks,
  avatarUrl,
  loading,
  fluid,
  className,
}) => {
  if (loading) {
    return <UserListItemSkeleton fluid={fluid} className={className} />
  }

  const displayName = name || 'Неизвестный пользователь'
  const displayId = id ? String(id) : ''
  const displayEmail = email || ''
  const displayFeedbacks = countFeedbacks ?? 0

  return (
    <article
      className={clsx(
        styles.userListItem,
        fluid && styles['userListItem--fluid'],
        className
      )}
    >
      <div className={styles.userListItem__container}>
        <div className={styles.userListItem__main}>
          <div className={styles.userListItem__avatar}>
            <Avatar
              src={avatarUrl || undefined}
              initials={getInitials(displayName)}
              size={AvatarSize.MD}
              alt={displayName}
            />
          </div>

          <div className={styles.userListItem__info}>
            <Heading5 className={styles.userListItem__name}>
              {displayName}
            </Heading5>
            {displayId && (
              <TextS className={styles.userListItem__id}>
                {displayId}
              </TextS>
            )}
          </div>
        </div>

        <div className={styles.userListItem__aside}>
          {displayEmail && (
            <TextMRegular className={styles.userListItem__email}>
              {displayEmail}
            </TextMRegular>
          )}

          <div className={styles.userListItem__feedbacks}>
            <TextMRegular>{displayFeedbacks}</TextMRegular>
            <Icon name={IconName.ReviewStar} size={IconSize.Small} />
          </div>
        </div>
      </div>
    </article>
  )
}

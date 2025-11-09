import { FC } from 'react'
import clsx from 'clsx'

import styles from '../CompanyListItem.module.scss'

interface CompanyListItemSkeletonProps {
  fluid?: boolean
}

export const CompanyListItemSkeleton: FC<CompanyListItemSkeletonProps> = ({
  fluid = false,
}) => {
  return (
    <div
      className={clsx(
        styles.companyList,
        styles['companyList--skeleton'],
        fluid && styles['companyList--fluid']
      )}
    >
      <div className={styles.companyList__box}>
        <div className={styles.companyList__wrapper}>
          <div className={styles.companyList__companyLogo}>
            <div className={clsx(styles.skeleton, styles['skeleton--logo'])} />
          </div>
          <div className={styles.companyList__boxName}>
            <div
              className={clsx(
                styles.skeleton,
                styles['skeleton--text'],
                styles['skeleton--name']
              )}
            />
            <div
              className={clsx(
                styles.skeleton,
                styles['skeleton--text'],
                styles['skeleton--description']
              )}
            />
          </div>
        </div>

        <div className={styles.companyList__boxText}>
          <div
            className={clsx(
              styles.skeleton,
              styles['skeleton--text'],
              styles['skeleton--feedbacks']
            )}
          />
          <div
            className={clsx(
              styles.skeleton,
              styles['skeleton--text'],
              styles['skeleton--grade']
            )}
          />
        </div>
      </div>
    </div>
  )
}

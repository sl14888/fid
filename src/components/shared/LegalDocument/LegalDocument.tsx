'use client'

import { FC, useEffect } from 'react'
import { useLegalDocumentsStore } from '@/store/legal-documents.store'
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'
import { HTMLRenderer } from '@/components/shared/HTMLRenderer'
import { Heading1 } from '@/components/ui/Typography'
import { MarkupType, LegalDocumentType } from '@/types/legal-document.types'
import styles from './LegalDocument.module.scss'

interface LegalDocumentProps {
  documentType: LegalDocumentType
}

export const LegalDocument: FC<LegalDocumentProps> = ({ documentType }) => {
  const { currentDocument, isLoading, error, fetchDocument } =
    useLegalDocumentsStore()

  useEffect(() => {
    fetchDocument(documentType)
  }, [documentType, fetchDocument])

  if (isLoading) {
    return (
      <div className={styles.legalDocument}>
        <div className={styles.legalDocument__loading}>
          <Heading1>Загрузка...</Heading1>
        </div>
      </div>
    )
  }

  if (error || !currentDocument) {
    return (
      <div className={styles.legalDocument}>
        <div className={styles.legalDocument__error}>
          <Heading1>Ошибка загрузки документа</Heading1>
          <p className={styles.legalDocument__errorMessage}>
            {error || 'Документ не найден'}
          </p>
          <button
            onClick={() => fetchDocument(documentType)}
            className={styles.legalDocument__retryButton}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (currentDocument.markup === MarkupType.MARKDOWN) {
      return <MarkdownRenderer content={currentDocument.text} />
    }
    if (currentDocument.markup === MarkupType.HTML) {
      return <HTMLRenderer content={currentDocument.text} />
    }
    return <p>Неподдерживаемый формат документа</p>
  }

  return (
    <div className={styles.legalDocument}>
      <div className={styles.legalDocument__container}>
        <div className={styles.legalDocument__content}>{renderContent()}</div>
      </div>
    </div>
  )
}

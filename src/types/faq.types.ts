export interface FaqItemText {
  priority: number
  question: string
  answer: string
}

export interface FaqItemDto {
  text: FaqItemText
  markup: 'MARKDOWN'
}

export interface FaqListResponse {
  data: FaqItemDto[]
  success: boolean
}

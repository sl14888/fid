export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export enum ContactStep {
  FORM = 'form',
  SUCCESS = 'success',
}

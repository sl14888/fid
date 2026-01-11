export interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginClick?: () => void
}

export enum ForgotPasswordStep {
  EMAIL = 1,
  CODE = 2,
  NEW_PASSWORD = 3,
  SUCCESS = 4,
}

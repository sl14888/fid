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

export interface EmailStepProps {
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  setEmail: (v: string) => void
  setCurrentStep: (v: ForgotPasswordStep) => void
}

export interface CodeStepProps {
  email: string
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  setVerificationCode: (v: string) => void
  setCurrentStep: (v: ForgotPasswordStep) => void
}

export interface NewPasswordStepProps {
  email: string
  verificationCode: string
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  setCurrentStep: (v: ForgotPasswordStep) => void
}

export interface SuccessStepProps {
  onLoginClick?: () => void
  onClose: () => void
}

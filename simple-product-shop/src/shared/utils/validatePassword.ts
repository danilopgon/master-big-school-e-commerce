type PasswordStrength = 'weak' | 'medium' | 'strong'

type ValidatePasswordResult = {
  isValid: boolean
  errors: string[]
  strength: PasswordStrength
}

const MINIMUM_LENGTH = 12
const STRONG_LENGTH = 16
const SPECIAL_CHARACTER_PATTERN = /[^A-Za-z0-9\s]/

export function validatePassword(password: string): ValidatePasswordResult {
  const errors: string[] = []

  if (password.length < MINIMUM_LENGTH) {
    errors.push('Password must be at least 12 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must include at least one number')
  }

  if (!hasSpecialCharacter(password)) {
    errors.push('Password must include at least one special character')
  }

  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    strength: getPasswordStrength(password, isValid),
  }
}

export function hasSpecialCharacter(password: string): boolean {
  return SPECIAL_CHARACTER_PATTERN.test(password)
}

function getPasswordStrength(password: string, isValid: boolean): PasswordStrength {
  if (!isValid) {
    return 'weak'
  }

  return password.length >= STRONG_LENGTH ? 'strong' : 'medium'
}

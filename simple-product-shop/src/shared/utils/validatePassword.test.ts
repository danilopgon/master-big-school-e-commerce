import { describe, expect, it } from 'vitest'

import { validatePassword } from '@/shared/utils/validatePassword'

describe('validatePassword', () => {
  it('fails with a specific error when password has fewer than 12 characters', () => {
    const result = validatePassword('Aa1!short')

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Password must be at least 12 characters long')
  })

  it('fails with a specific error when password has no uppercase letter', () => {
    const result = validatePassword('validpass123!')

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Password must include at least one uppercase letter')
  })

  it('fails with a specific error when password has no lowercase letter', () => {
    const result = validatePassword('VALIDPASS123!')

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Password must include at least one lowercase letter')
  })

  it('fails with a specific error when password has no number', () => {
    const result = validatePassword('ValidPassword!')

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Password must include at least one number')
  })

  it('fails with a specific error when password has no special character', () => {
    const result = validatePassword('ValidPassword123')

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Password must include at least one special character')
  })

  it('accepts punctuation characters as special characters', () => {
    const result = validatePassword('ValidPassword123?')

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('returns weak strength for invalid passwords', () => {
    expect(validatePassword('invalid').strength).toBe('weak')
  })

  it('returns medium strength for valid passwords with 12 to 15 characters', () => {
    expect(validatePassword('ValidPass12!').strength).toBe('medium')
    expect(validatePassword('ValidPass1234!').strength).toBe('medium')
  })

  it('returns strong strength for valid passwords with 16 or more characters', () => {
    expect(validatePassword('ValidPassword123!').strength).toBe('strong')
  })

  it('returns isValid true and empty errors for valid passwords', () => {
    const result = validatePassword('ValidPass12!')

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })
})

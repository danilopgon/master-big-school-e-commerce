import { describe, expect, it } from 'vitest'

import { formatPrice } from '@/shared/utils/formatPrice'

describe('formatPrice', () => {
  it('formats integer prices as USD with two decimals', () => {
    expect(formatPrice(25)).toBe('$25.00')
  })

  it('formats decimal prices as USD with two decimals', () => {
    expect(formatPrice(19.99)).toBe('$19.99')
  })

  it('formats zero as USD with two decimals', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('formats large prices with thousands separators', () => {
    expect(formatPrice(1234567.89)).toBe('$1,234,567.89')
  })
})

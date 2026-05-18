import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCurrency } from './useCurrency'

describe('useCurrency', () => {
  it('formats and parses currency values', () => {
    const { result } = renderHook(() => useCurrency())

    expect(result.current.format(25)).toBe('$25.00')
    expect(result.current.parse('$1,234.56')).toBe(1234.56)
  })
})

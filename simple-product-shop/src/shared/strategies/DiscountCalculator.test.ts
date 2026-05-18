import { describe, expect, it } from 'vitest'

import { DiscountCalculator } from '@/shared/strategies/DiscountCalculator'
import type { CartItem } from '@/shared/types'

describe('DiscountCalculator', () => {
  const calculator = new DiscountCalculator()

  const createCartItem = (price: number, quantity: number): CartItem => ({
    product: {
      id: `product-${price}-${quantity}`,
      name: 'Test Product',
      price,
      image: 'https://picsum.photos/seed/test-product/200',
      description: 'Test product description.',
    },
    quantity,
  })

  it('returns 0 for an empty cart', () => {
    expect(calculator.calculate([], 0)).toBe(0)
  })

  it('applies only the bulk discount when the remaining subtotal is below the order minimum', () => {
    const items = [createCartItem(10, 5)]

    expect(calculator.calculate(items, 50)).toBe(5)
  })

  it('applies only the order discount when no item qualifies for the bulk discount', () => {
    const items = [createCartItem(40, 3)]

    expect(calculator.calculate(items, 120)).toBe(18)
  })

  it('applies both discounts sequentially when both are applicable', () => {
    const items = [createCartItem(25, 5)]

    expect(calculator.calculate(items, 125)).toBeCloseTo(29.375)
  })

  it('returns a breakdown with the name and amount of each applied discount', () => {
    const items = [createCartItem(25, 5)]

    expect(calculator.getBreakdown(items, 125)).toEqual([
      { name: 'Bulk Discount', amount: 12.5 },
      { name: 'Order Discount', amount: 16.875 },
    ])
  })
})

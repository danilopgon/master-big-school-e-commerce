import { describe, expect, it } from 'vitest'

import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { BulkDiscountStrategy } from '@/shared/strategies/BulkDiscountStrategy'
import type { CartItem } from '@/shared/types'

describe('BulkDiscountStrategy', () => {
  const strategy = new BulkDiscountStrategy()

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

  it('has the correct name', () => {
    expect(strategy.name).toBe('Bulk Discount')
  })

  it('is not applicable when no item has the bulk minimum quantity', () => {
    const items = [createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity - 1)]

    expect(strategy.isApplicable(items, 80)).toBe(false)
  })

  it('is applicable when any item has the bulk minimum quantity', () => {
    const items = [createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity)]

    expect(strategy.isApplicable(items, 100)).toBe(true)
  })

  it('calculates the discount for qualifying items', () => {
    const items = [createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity)]

    expect(strategy.calculate(items, 100)).toBe(10)
  })

  it('only discounts qualifying items when multiple items are present', () => {
    const items = [
      createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity),
      createCartItem(30, BUSINESS_RULES.bulkDiscount.minimumQuantity - 1),
      createCartItem(10, BUSINESS_RULES.bulkDiscount.minimumQuantity + 1),
    ]

    expect(strategy.calculate(items, 280)).toBe(16)
  })
})

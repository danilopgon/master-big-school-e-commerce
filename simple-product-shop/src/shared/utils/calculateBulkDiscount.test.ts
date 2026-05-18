import { describe, expect, it } from 'vitest'

import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem } from '@/shared/types'
import { calculateBulkDiscount } from '@/shared/utils/calculateBulkDiscount'

describe('calculateBulkDiscount', () => {
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

  it('returns 0 when an item has fewer than the bulk minimum quantity', () => {
    const items = [createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity - 1)]

    expect(calculateBulkDiscount(items)).toBe(0)
  })

  it('calculates the discount when an item has exactly the bulk minimum quantity', () => {
    const items = [createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity)]

    expect(calculateBulkDiscount(items)).toBe(10)
  })

  it('calculates the discount when an item has more than the bulk minimum quantity', () => {
    const items = [createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity + 1)]

    expect(calculateBulkDiscount(items)).toBe(12)
  })

  it('only discounts items that qualify for the bulk discount', () => {
    const items = [
      createCartItem(20, BUSINESS_RULES.bulkDiscount.minimumQuantity),
      createCartItem(30, BUSINESS_RULES.bulkDiscount.minimumQuantity - 1),
      createCartItem(10, BUSINESS_RULES.bulkDiscount.minimumQuantity + 1),
    ]

    expect(calculateBulkDiscount(items)).toBe(16)
  })
})

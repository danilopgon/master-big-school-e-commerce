import { describe, expect, it } from 'vitest'

import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { OrderDiscountStrategy } from '@/shared/strategies/OrderDiscountStrategy'

describe('OrderDiscountStrategy', () => {
  const strategy = new OrderDiscountStrategy()

  it('has the correct name', () => {
    expect(strategy.name).toBe('Order Discount')
  })

  it('is not applicable when subtotal is less than the order discount minimum', () => {
    const subtotal = BUSINESS_RULES.orderDiscount.minimumSubtotal - 1

    expect(strategy.isApplicable([], subtotal)).toBe(false)
  })

  it('is applicable when subtotal meets the order discount minimum', () => {
    const subtotal = BUSINESS_RULES.orderDiscount.minimumSubtotal

    expect(strategy.isApplicable([], subtotal)).toBe(true)
  })

  it('calculates the discount from the subtotal', () => {
    const subtotal = 200

    expect(strategy.calculate([], subtotal)).toBe(30)
  })
})

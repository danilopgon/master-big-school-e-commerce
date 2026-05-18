import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { DiscountStrategy } from '@/shared/strategies/DiscountStrategy'
import type { CartItem } from '@/shared/types'

export class OrderDiscountStrategy implements DiscountStrategy {
  name = 'Order Discount'

  description = `Get ${BUSINESS_RULES.orderDiscount.rate * 100}% off orders of $${BUSINESS_RULES.orderDiscount.minimumSubtotal} or more.`

  isApplicable(_items: CartItem[], subtotal: number): boolean {
    return subtotal >= BUSINESS_RULES.orderDiscount.minimumSubtotal
  }

  calculate(_items: CartItem[], subtotal: number): number {
    return subtotal * BUSINESS_RULES.orderDiscount.rate
  }
}

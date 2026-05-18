import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { DiscountStrategy } from '@/shared/strategies/DiscountStrategy'
import type { CartItem } from '@/shared/types'

export class BulkDiscountStrategy implements DiscountStrategy {
  name = 'Bulk Discount'

  description = `Get ${BUSINESS_RULES.bulkDiscount.rate * 100}% off items when buying ${BUSINESS_RULES.bulkDiscount.minimumQuantity} or more units.`

  isApplicable(items: CartItem[]): boolean {
    return items.some((item) => item.quantity >= BUSINESS_RULES.bulkDiscount.minimumQuantity)
  }

  calculate(items: CartItem[]): number {
    return items.reduce((discount, item) => {
      if (item.quantity < BUSINESS_RULES.bulkDiscount.minimumQuantity) {
        return discount
      }

      return discount + item.product.price * item.quantity * BUSINESS_RULES.bulkDiscount.rate
    }, 0)
  }
}

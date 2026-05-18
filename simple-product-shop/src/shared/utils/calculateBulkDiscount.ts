import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import type { CartItem } from '@/shared/types'

export function calculateBulkDiscount(items: CartItem[]): number {
  return items.reduce((discount, item) => {
    if (item.quantity < BUSINESS_RULES.bulkDiscount.minimumQuantity) {
      return discount
    }

    return discount + item.product.price * item.quantity * BUSINESS_RULES.bulkDiscount.rate
  }, 0)
}

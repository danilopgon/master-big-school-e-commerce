import { BulkDiscountStrategy } from '@/shared/strategies/BulkDiscountStrategy'
import type { DiscountStrategy } from '@/shared/strategies/DiscountStrategy'
import { OrderDiscountStrategy } from '@/shared/strategies/OrderDiscountStrategy'
import type { CartItem } from '@/shared/types'

type DiscountBreakdownItem = {
  name: string
  amount: number
}

export class DiscountCalculator {
  private strategies: DiscountStrategy[] = [
    new BulkDiscountStrategy(),
    new OrderDiscountStrategy(),
  ]

  calculate(items: CartItem[], subtotal: number): number {
    return this.getBreakdown(items, subtotal).reduce((total, discount) => total + discount.amount, 0)
  }

  getBreakdown(items: CartItem[], subtotal: number): DiscountBreakdownItem[] {
    const breakdown: DiscountBreakdownItem[] = []
    let remainingSubtotal = subtotal

    for (const strategy of this.strategies) {
      if (!strategy.isApplicable(items, remainingSubtotal)) {
        continue
      }

      const amount = strategy.calculate(items, remainingSubtotal)
      breakdown.push({ name: strategy.name, amount })
      remainingSubtotal -= amount
    }

    return breakdown
  }
}

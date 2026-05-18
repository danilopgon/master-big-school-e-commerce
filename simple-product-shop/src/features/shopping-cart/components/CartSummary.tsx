import { BUSINESS_RULES, UI_TEXT } from '@/shared/constants'
import { useCurrency } from '@/shared/hooks'

type DiscountBreakdownItem = {
  name: string
  amount: number
}

type CartSummaryProps = {
  subtotal: number
  discount: number
  total: number
  itemCount: number
  discountBreakdown: DiscountBreakdownItem[]
}

export function CartSummary({
  subtotal,
  discount,
  total,
  itemCount,
  discountBreakdown,
}: CartSummaryProps) {
  const amountUntilOrderDiscount = BUSINESS_RULES.orderDiscount.minimumSubtotal - subtotal
  const orderDiscountPercent = BUSINESS_RULES.orderDiscount.rate * 100
  const currency = useCurrency()

  return (
    <section className="rounded-lg bg-slate-100 p-5 shadow-sm dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{UI_TEXT.cartSummary}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
      </p>

      <div className="mt-4 space-y-3 border-y border-slate-200 py-4 dark:border-slate-800">
        <div className="flex justify-between gap-4 text-slate-700 dark:text-slate-200">
          <span>Subtotal</span>
          <span data-testid="cart-summary-subtotal">{currency.format(subtotal)}</span>
        </div>

        {discount > 0
          ? discountBreakdown.map((discountItem) => (
              <div
                key={discountItem.name}
                className="flex justify-between gap-4 text-green-700 dark:text-green-400"
              >
                <span>{discountItem.name}</span>
                <span>-{currency.format(discountItem.amount)}</span>
              </div>
            ))
          : null}

        <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-xl font-bold text-slate-950 dark:border-slate-800 dark:text-slate-50">
          <span>Total</span>
          <span data-testid="cart-summary-total">{currency.format(total)}</span>
        </div>
      </div>

      {amountUntilOrderDiscount > 0 ? (
        <p className="mt-4 rounded bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900 dark:bg-amber-400/20 dark:text-amber-200">
          Add {currency.format(amountUntilOrderDiscount)} more for {orderDiscountPercent}% off!
        </p>
      ) : null}

      <button
        type="button"
        className="mt-5 w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
      >
        {UI_TEXT.checkout}
      </button>
    </section>
  )
}

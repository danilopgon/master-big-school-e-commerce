import { BUSINESS_RULES, UI_TEXT } from '@/shared/constants'
import { useCurrency } from '@/shared/hooks'
import type { CartItem as CartItemType } from '@/shared/types'

type CartItemProps = {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item
  const subtotal = product.price * quantity
  const currency = useCurrency()

  return (
    <article className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <img src={product.image} alt={product.name} className="h-16 w-16 rounded object-cover" />

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-slate-950 dark:text-slate-50">
          {product.name}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Unit price: {currency.format(product.price)}
        </p>
        <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">
          Subtotal: {currency.format(subtotal)}
        </p>
      </div>

      <div className="col-span-2 flex flex-wrap items-center justify-end gap-2 sm:col-start-2 sm:col-end-3 sm:justify-start">
        <button
          type="button"
          aria-label={`Decrease quantity of ${product.name}. Current quantity: ${quantity}`}
          onClick={() => onUpdateQuantity(quantity - BUSINESS_RULES.quantity.step)}
          disabled={quantity <= BUSINESS_RULES.quantity.minimum}
          className="flex h-9 w-9 items-center justify-center rounded border border-slate-300 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          -
        </button>
        <span
          data-testid="cart-item-quantity"
          className="min-w-6 text-center font-medium text-slate-950 dark:text-slate-50"
        >
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`Increase quantity of ${product.name}. Current quantity: ${quantity}`}
          onClick={() => onUpdateQuantity(quantity + BUSINESS_RULES.quantity.step)}
          className="flex h-9 w-9 items-center justify-center rounded border border-slate-300 font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          +
        </button>
        <button
          type="button"
          aria-label={`Remove ${product.name} from cart`}
          onClick={onRemove}
          className="ml-2 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:bg-red-500 dark:text-slate-950 dark:hover:bg-red-400"
        >
          {UI_TEXT.remove}
        </button>
      </div>
    </article>
  )
}

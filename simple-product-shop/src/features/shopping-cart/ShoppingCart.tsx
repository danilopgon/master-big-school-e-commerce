import { CartItem, CartSummary } from '@/features/shopping-cart/components'
import { useCart } from '@/context'
import { UI_TEXT } from '@/shared/constants'

export function ShoppingCart() {
  const { items, itemCount, subtotal, discount, total, discountBreakdown, removeItem, updateQuantity } =
    useCart()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{UI_TEXT.shoppingCart}</h1>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white dark:bg-blue-500 dark:text-slate-950">
          {itemCount}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <p className="mt-3 text-lg font-medium text-slate-700 dark:text-slate-200">
            {UI_TEXT.emptyCart}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.product.id, quantity)}
                onRemove={() => removeItem(item.product.id)}
              />
            ))}
          </div>

          <CartSummary
            subtotal={subtotal}
            discount={discount}
            total={total}
            itemCount={itemCount}
            discountBreakdown={discountBreakdown}
          />
        </div>
      )}
    </section>
  )
}

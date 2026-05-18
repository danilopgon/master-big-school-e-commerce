import { CartProvider, useCart } from '@/context'
import { LoginDemo } from '@/features/auth/LoginDemo'
import { ProductCatalog } from '@/features/product-catalog/ProductCatalog'
import { ShoppingCart } from '@/features/shopping-cart'
import { useCurrency } from '@/shared/hooks'

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

function AppContent() {
  const { addItem, itemCount, total } = useCart()
  const currency = useCurrency()
  const itemLabel = itemCount === 1 ? 'item' : 'items'

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-left text-slate-900 transition-colors sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50">
            Simple Product Shop
          </h1>

          <div
            aria-label={`Shopping cart contains ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-slate-50 shadow-sm dark:bg-slate-100 dark:text-slate-950"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="absolute -right-1 -top-1 min-w-6 rounded-full bg-blue-600 px-1.5 py-0.5 text-center text-xs font-bold text-white dark:bg-blue-500 dark:text-slate-950">
              {itemCount}
            </span>
          </div>
        </header>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Cart updated: {itemCount} {itemLabel}, total {currency.format(total)}
        </div>

        <main className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <ProductCatalog onAddToCart={addItem} />

          <aside className="space-y-6 lg:sticky lg:top-8">
            <details className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer text-lg font-semibold text-slate-950 marker:text-blue-600 dark:text-slate-50 dark:marker:text-blue-400">
                Try secure login
              </summary>
              <div className="mt-4">
                <LoginDemo />
              </div>
            </details>

            <ShoppingCart />
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App

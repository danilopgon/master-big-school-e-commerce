import { ProductCard } from '@/features/product-catalog/components/ProductCard'
import { products } from '@/shared/data/products'
import type { Product } from '@/shared/types'

type ProductCatalogProps = {
  onAddToCart: (product: Product) => void
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-50">Products</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'

import type { Product } from '@/shared/types'

import { ProductCatalog } from '@/features/product-catalog/ProductCatalog'

const mockProducts = vi.hoisted(
  (): Product[] => [
    {
      id: 'product-1',
      name: 'Wireless Headphones',
      price: 89.99,
      image: 'https://picsum.photos/seed/headphones/200',
      description: 'Comfortable headphones with clear wireless sound.',
    },
    {
      id: 'product-2',
      name: 'USB-C Hub',
      price: 34.99,
      image: 'https://picsum.photos/seed/usb-hub/200',
      description: 'Compact hub with HDMI, USB, and fast transfer ports.',
    },
  ],
)

vi.mock('@/shared/data/products', () => ({
  products: mockProducts,
}))

describe('ProductCatalog', () => {
  it('shows the heading and renders all products', async () => {
    const onAddToCart = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    await act(async () => {
      root.render(<ProductCatalog onAddToCart={onAddToCart} />)
    })

    expect(container).toHaveTextContent('Products')
    expect(container).toHaveTextContent('Wireless Headphones')
    expect(container).toHaveTextContent('USB-C Hub')

    const addToCartButtons = container.querySelectorAll('button')

    expect(addToCartButtons).toHaveLength(2)

    await act(async () => {
      addToCartButtons[0]?.click()
    })

    expect(onAddToCart).toHaveBeenCalledWith(mockProducts[0])

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})

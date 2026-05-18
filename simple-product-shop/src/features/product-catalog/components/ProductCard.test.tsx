import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Product } from '@/shared/types'
import { UI_TEXT } from '@/shared/constants'

import { ProductCard } from '@/features/product-catalog/components/ProductCard'

const product: Product = {
  id: 'product-1',
  name: 'Mechanical Keyboard',
  price: 129.99,
  image: '/images/mechanical-keyboard.jpg',
  description: 'Compact mechanical keyboard with tactile switches and backlit keys.',
}

async function renderProductCard({ onAddToCart = vi.fn() } = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(<ProductCard product={product} onAddToCart={onAddToCart} />)
  })

  return { container, root, onAddToCart }
}

describe('ProductCard', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows product details and calls onAddToCart with the product', async () => {
    const { container, root, onAddToCart } = await renderProductCard()

    expect(container).toHaveTextContent('Mechanical Keyboard')
    expect(container).toHaveTextContent('Compact mechanical keyboard with tactile switches and backlit keys.')
    expect(container).toHaveTextContent('$129.99')

    const addToCartButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === UI_TEXT.addToCart,
    )

    expect(addToCartButton).toBeInTheDocument()

    await act(async () => {
      addToCartButton?.click()
    })

    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(product)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('shows loading immediately, then success feedback before returning to idle', async () => {
    vi.useFakeTimers()
    const { container, root, onAddToCart } = await renderProductCard()
    const addToCartButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === UI_TEXT.addToCart,
    )

    await act(async () => {
      addToCartButton?.click()
    })

    expect(addToCartButton).toHaveTextContent('Added!')
    expect(addToCartButton).toHaveTextContent(UI_TEXT.addedToCart)

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(addToCartButton).toHaveTextContent(UI_TEXT.addToCart)

    expect(onAddToCart).toHaveBeenCalledTimes(1)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('shows loading while add to cart is pending', async () => {
    let resolveAddToCart: () => void = vi.fn()
    const onAddToCart = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAddToCart = resolve
        }),
    )
    const { container, root } = await renderProductCard({ onAddToCart })
    const addToCartButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === UI_TEXT.addToCart,
    )

    await act(async () => {
      addToCartButton?.click()
    })

    expect(addToCartButton).toHaveTextContent('Adding...')

    await act(async () => {
      resolveAddToCart()
    })

    expect(addToCartButton).toHaveTextContent(UI_TEXT.addedToCart)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('shows failed feedback when add to cart throws and then returns to idle', async () => {
    vi.useFakeTimers()
    const onAddToCart = vi.fn(() => {
      throw new Error('Add failed')
    })
    const { container, root } = await renderProductCard({ onAddToCart })
    const addToCartButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === UI_TEXT.addToCart,
    )

    await act(async () => {
      addToCartButton?.click()
    })

    expect(addToCartButton).toHaveTextContent('Failed')

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(addToCartButton).toHaveTextContent(UI_TEXT.addToCart)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})

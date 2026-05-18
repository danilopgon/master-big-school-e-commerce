import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'

import type { CartItem as CartItemType } from '@/shared/types'

import { CartItem } from '@/features/shopping-cart/components'

const cartItem: CartItemType = {
  product: {
    id: 'product-1',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: '/images/mechanical-keyboard.jpg',
    description: 'Compact mechanical keyboard with tactile switches and backlit keys.',
  },
  quantity: 2,
}

async function renderCartItem({
  item = cartItem,
  onUpdateQuantity = vi.fn(),
  onRemove = vi.fn(),
}: {
  item?: CartItemType
  onUpdateQuantity?: (quantity: number) => void
  onRemove?: () => void
} = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(
      <CartItem item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />,
    )
  })

  return { container, root, onUpdateQuantity, onRemove }
}

describe('CartItem', () => {
  it('renders the product name and unit price', async () => {
    const { container, root } = await renderCartItem()

    expect(container).toHaveTextContent('Mechanical Keyboard')
    expect(container).toHaveTextContent('$129.99')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('renders the current quantity', async () => {
    const { container, root } = await renderCartItem()

    expect(container).toHaveTextContent('2')
    expect(container.querySelector('[data-testid="cart-item-quantity"]')).toHaveTextContent('2')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('renders the calculated subtotal', async () => {
    const { container, root } = await renderCartItem()

    expect(container).toHaveTextContent('$259.98')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('calls onUpdateQuantity with the incremented quantity when clicking +', async () => {
    const onUpdateQuantity = vi.fn()
    const { container, root } = await renderCartItem({ onUpdateQuantity })
    const increaseButton = container.querySelector(
      'button[aria-label="Increase quantity of Mechanical Keyboard. Current quantity: 2"]',
    )

    await act(async () => {
      increaseButton?.click()
    })

    expect(onUpdateQuantity).toHaveBeenCalledTimes(1)
    expect(onUpdateQuantity).toHaveBeenCalledWith(3)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('calls onUpdateQuantity with the decremented quantity when clicking -', async () => {
    const onUpdateQuantity = vi.fn()
    const { container, root } = await renderCartItem({ onUpdateQuantity })
    const decreaseButton = container.querySelector(
      'button[aria-label="Decrease quantity of Mechanical Keyboard. Current quantity: 2"]',
    )

    await act(async () => {
      decreaseButton?.click()
    })

    expect(onUpdateQuantity).toHaveBeenCalledTimes(1)
    expect(onUpdateQuantity).toHaveBeenCalledWith(1)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('disables the - button when quantity is 1', async () => {
    const { container, root } = await renderCartItem({
      item: {
        ...cartItem,
        quantity: 1,
      },
    })
    const decreaseButton = container.querySelector(
      'button[aria-label="Decrease quantity of Mechanical Keyboard. Current quantity: 1"]',
    )

    expect(decreaseButton).toBeDisabled()

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('calls onRemove when clicking remove', async () => {
    const onRemove = vi.fn()
    const { container, root } = await renderCartItem({ onRemove })
    const removeButton = container.querySelector(
      'button[aria-label="Remove Mechanical Keyboard from cart"]',
    )

    await act(async () => {
      removeButton?.click()
    })

    expect(onRemove).toHaveBeenCalledTimes(1)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})

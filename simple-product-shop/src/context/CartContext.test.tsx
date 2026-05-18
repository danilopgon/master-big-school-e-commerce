import { type ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { CartProvider } from '@/context/CartContext'
import { useCart } from '@/context/useCart'
import type { Product } from '@/shared/types'

const STORAGE_KEY = 'cart'

const keyboard: Product = {
  id: 'product-1',
  name: 'Mechanical Keyboard',
  price: 129.99,
  image: '/images/mechanical-keyboard.jpg',
  description: 'Compact mechanical keyboard with tactile switches and backlit keys.',
}

const mouse: Product = {
  id: 'product-2',
  name: 'Wireless Mouse',
  price: 49.5,
  image: '/images/wireless-mouse.jpg',
  description: 'Ergonomic wireless mouse with long battery life.',
}

const headphones: Product = {
  id: 'product-3',
  name: 'Studio Headphones',
  price: 25,
  image: '/images/studio-headphones.jpg',
  description: 'Closed-back headphones for focused listening.',
}

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}

function renderCart() {
  return renderHook(() => useCart(), { wrapper })
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty cart', () => {
    const { result } = renderCart()

    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.discount).toBe(0)
    expect(result.current.total).toBe(0)
    expect(result.current.discountBreakdown).toEqual([])
  })

  it('adds a new product with quantity 1', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
    })

    expect(result.current.items).toEqual([{ product: keyboard, quantity: 1 }])
  })

  it('increments the quantity when adding an existing product', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.addItem(keyboard)
    })

    expect(result.current.items).toEqual([{ product: keyboard, quantity: 2 }])
  })

  it('updates the quantity of an item', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.updateQuantity(keyboard.id, 4)
    })

    expect(result.current.items).toEqual([{ product: keyboard, quantity: 4 }])
  })

  it('removes an item when updating its quantity to 0', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.updateQuantity(keyboard.id, 0)
    })

    expect(result.current.items).toEqual([])
  })

  it('removes an item from the cart', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.addItem(mouse)
      result.current.removeItem(keyboard.id)
    })

    expect(result.current.items).toEqual([{ product: mouse, quantity: 1 }])
  })

  it('clears all items from the cart', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.addItem(mouse)
      result.current.clearCart()
    })

    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.discount).toBe(0)
    expect(result.current.total).toBe(0)
    expect(result.current.discountBreakdown).toEqual([])
  })

  it('counts all item quantities', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.addItem(keyboard)
      result.current.addItem(mouse)
      result.current.updateQuantity(mouse.id, 3)
    })

    expect(result.current.itemCount).toBe(5)
  })

  it('calculates the subtotal from price times quantity for each item', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(keyboard)
      result.current.addItem(mouse)
      result.current.updateQuantity(keyboard.id, 2)
      result.current.updateQuantity(mouse.id, 3)
    })

    expect(result.current.subtotal).toBe(408.48)
  })

  it('calculates discount, total, and breakdown when items change', () => {
    const { result } = renderCart()

    act(() => {
      result.current.addItem(headphones)
      result.current.updateQuantity(headphones.id, 5)
    })

    expect(result.current.subtotal).toBe(125)
    expect(result.current.discount).toBeCloseTo(29.375)
    expect(result.current.total).toBeCloseTo(95.625)
    expect(result.current.discountBreakdown).toEqual([
      { name: 'Bulk Discount', amount: 12.5 },
      { name: 'Order Discount', amount: 16.875 },
    ])
  })

  it('loads cart items from localStorage on init', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { product: keyboard, quantity: 2 },
        { product: mouse, quantity: 1 },
      ]),
    )

    const { result } = renderCart()

    expect(result.current.items).toEqual([
      { product: keyboard, quantity: 2 },
      { product: mouse, quantity: 1 },
    ])
    expect(result.current.itemCount).toBe(3)
    expect(result.current.subtotal).toBe(309.48)
  })
})

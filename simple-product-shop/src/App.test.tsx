import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App', () => {
  it('describes the cart badge item count for screen readers', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([
        {
          product: {
            id: 'product-1',
            name: 'Mechanical Keyboard',
            price: 129.99,
            image: '/images/mechanical-keyboard.jpg',
            description: 'Compact mechanical keyboard with tactile switches and backlit keys.',
          },
          quantity: 3,
        },
      ]),
    )
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    await act(async () => {
      root.render(<App />)
    })

    expect(
      container.querySelector('div[aria-label="Shopping cart contains 3 items"]'),
    ).toBeInTheDocument()

    await act(async () => {
      root.unmount()
    })
    container.remove()
    localStorage.clear()
  })

  it('announces cart item count and total in a polite live region', async () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([
        {
          product: {
            id: 'product-2',
            name: 'USB Cable',
            price: 20,
            image: '/images/usb-cable.jpg',
            description: 'Durable charging cable.',
          },
          quantity: 1,
        },
      ]),
    )
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    await act(async () => {
      root.render(<App />)
    })

    const liveRegion = container.querySelector('[aria-live="polite"]')

    expect(liveRegion).toHaveClass('sr-only')
    expect(liveRegion).toHaveTextContent('Cart updated: 1 item, total $20.00')

    await act(async () => {
      root.unmount()
    })
    container.remove()
    localStorage.clear()
  })
})

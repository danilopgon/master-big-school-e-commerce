import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'

import { CartSummary } from '@/features/shopping-cart/components'
import { UI_TEXT } from '@/shared/constants'

const BULK_DISCOUNT_LABEL = 'Bulk Discount'
const ORDER_DISCOUNT_LABEL = 'Order Discount'

async function renderCartSummary({
  subtotal = 89.99,
  discount = 0,
  total = 89.99,
  itemCount = 2,
  discountBreakdown = [],
}: {
  subtotal?: number
  discount?: number
  total?: number
  itemCount?: number
  discountBreakdown?: { name: string; amount: number }[]
} = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(
      <CartSummary
        subtotal={subtotal}
        discount={discount}
        total={total}
        itemCount={itemCount}
        discountBreakdown={discountBreakdown}
      />,
    )
  })

  return { container, root }
}

describe('CartSummary', () => {
  it('renders the formatted subtotal', async () => {
    const { container, root } = await renderCartSummary({ subtotal: 89.99 })
    const subtotal = container.querySelector('[data-testid="cart-summary-subtotal"]')

    expect(container).toHaveTextContent('Subtotal')
    expect(container).toHaveTextContent('$89.99')
    expect(subtotal).toHaveTextContent('$89.99')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('renders each discount from the breakdown with a negative amount', async () => {
    const { container, root } = await renderCartSummary({
      subtotal: 120,
      discount: 30.5,
      total: 89.5,
      discountBreakdown: [
        { name: BULK_DISCOUNT_LABEL, amount: 12.5 },
        { name: ORDER_DISCOUNT_LABEL, amount: 18 },
      ],
    })

    expect(container).toHaveTextContent(BULK_DISCOUNT_LABEL)
    expect(container).toHaveTextContent('-$12.50')
    expect(container).toHaveTextContent(ORDER_DISCOUNT_LABEL)
    expect(container).toHaveTextContent('-$18.00')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('does not render the discount line when discount is 0', async () => {
    const { container, root } = await renderCartSummary({ discount: 0 })

    expect(container).not.toHaveTextContent(BULK_DISCOUNT_LABEL)
    expect(container).not.toHaveTextContent(ORDER_DISCOUNT_LABEL)

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('renders the formatted total', async () => {
    const { container, root } = await renderCartSummary({ total: 102 })
    const total = container.querySelector('[data-testid="cart-summary-total"]')

    expect(container).toHaveTextContent('Total')
    expect(container).toHaveTextContent('$102.00')
    expect(total).toHaveTextContent('$102.00')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('shows the remaining amount needed for the order discount', async () => {
    const { container, root } = await renderCartSummary({ subtotal: 75 })

    expect(container).toHaveTextContent('Add $25.00 more for 15% off!')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('does not show the promotional message when subtotal is at least 100', async () => {
    const { container, root } = await renderCartSummary({ subtotal: 100 })

    expect(container).not.toHaveTextContent('more for 15% off')

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  it('renders the checkout button', async () => {
    const { container, root } = await renderCartSummary()
    const checkoutButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === UI_TEXT.checkout,
    )

    expect(checkoutButton).toBeInTheDocument()

    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})

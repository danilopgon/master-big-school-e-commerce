import { expect, test } from '@playwright/test'

import { ProductCatalogPage } from './pages/ProductCatalogPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'

const productName = 'Wireless Headphones'

test.describe('shopping journey', () => {
  let catalog: ProductCatalogPage
  let cart: ShoppingCartPage

  test.beforeEach(async ({ page }) => {
    catalog = new ProductCatalogPage(page)
    cart = new ShoppingCartPage(page)

    await catalog.goto()
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('starts with an empty cart', async () => {
    await expect(cart.heading, 'cart heading should be visible').toBeVisible()
    await expect(cart.emptyMessage, 'empty cart message should be visible').toBeVisible()
    await expect(cart.checkoutButton, 'checkout should not be available for an empty cart').toBeHidden()
  })

  test('shows a product in the cart after adding it', async () => {
    await catalog.addToCart(productName)

    await expect(cart.getItem(productName), 'added product should appear in the cart').toBeVisible()
    await expect(cart.subtotal, 'subtotal should include the added product price').toHaveText('$89.99')
    await expect(cart.total, 'total should match subtotal without discounts').toHaveText('$89.99')
  })

  test('increments quantity when adding the same product again', async () => {
    await catalog.addToCart(productName)
    await catalog.addToCart(productName)

    await expect
      .poll(() => cart.getQuantity(productName), {
        message: 'same product should have quantity 2 after being added twice',
      })
      .toBe(2)
  })

  test('updates quantity with increase and decrease buttons', async () => {
    await catalog.addToCart(productName)

    await cart.incrementQuantity(productName)
    await expect
      .poll(() => cart.getQuantity(productName), {
        message: 'increase button should increment item quantity',
      })
      .toBe(2)

    await cart.decrementQuantity(productName)
    await expect
      .poll(() => cart.getQuantity(productName), {
        message: 'decrease button should decrement item quantity',
      })
      .toBe(1)
  })

  test('removes an item from the cart', async () => {
    await catalog.addToCart(productName)
    await cart.removeItem(productName)

    await expect(cart.getItem(productName), 'removed product should no longer be in the cart').toBeHidden()
    await expect(cart.emptyMessage, 'cart should show empty state after removing the last item').toBeVisible()
  })

  test('shows the bulk discount when a product reaches five units', async ({ page }) => {
    for (let index = 0; index < 5; index += 1) {
      await catalog.addToCart(productName)
    }

    await expect
      .poll(() => cart.getQuantity(productName), {
        message: 'bulk discount requires five units of the same product',
      })
      .toBe(5)
    await expect(page.getByText('Bulk Discount'), 'bulk discount line should be visible').toBeVisible()
  })

  test('persists the cart after refresh', async ({ page }) => {
    await catalog.addToCart(productName)
    await expect
      .poll(() => cart.getQuantity(productName), {
        message: 'cart should contain the product before refreshing',
      })
      .toBe(1)

    await page.reload()

    await expect(cart.getItem(productName), 'cart item should persist after refresh').toBeVisible()
    await expect
      .poll(() => cart.getQuantity(productName), {
        message: 'persisted cart item should keep its quantity after refresh',
      })
      .toBe(1)
  })
})

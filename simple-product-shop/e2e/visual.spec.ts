import { expect, test } from '@playwright/test'

import { ProductCatalogPage } from './pages/ProductCatalogPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'

const screenshotOptions = {
  fullPage: true,
  maxDiffPixelRatio: 0.05,
} as const

test.describe('visual regression', () => {
  let catalog: ProductCatalogPage
  let cart: ShoppingCartPage

  test.beforeEach(async ({ page }) => {
    catalog = new ProductCatalogPage(page)
    cart = new ShoppingCartPage(page)

    await catalog.goto()
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('matches the homepage catalog screenshot', async ({ page }) => {
    await expect(catalog.productHeading).toBeVisible()

    await expect(page).toHaveScreenshot('homepage-catalog.png', screenshotOptions)
  })

  test('matches the cart with items screenshot', async ({ page }) => {
    await catalog.addToCart('Wireless Headphones')
    await catalog.addToCart('Mechanical Keyboard')

    await expect(cart.getItem('Wireless Headphones')).toBeVisible()
    await expect(cart.getItem('Mechanical Keyboard')).toBeVisible()

    await expect(page).toHaveScreenshot('cart-with-items.png', screenshotOptions)
  })
})

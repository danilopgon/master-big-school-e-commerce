import type { Locator, Page } from '@playwright/test'

export class ShoppingCartPage {
  readonly page: Page
  readonly root: Locator
  readonly heading: Locator
  readonly emptyMessage: Locator
  readonly checkoutButton: Locator
  readonly subtotal: Locator
  readonly total: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Shopping Cart' })
    this.root = page.locator('section').filter({ has: this.heading })
    this.emptyMessage = this.root.getByText('Your cart is empty')
    this.checkoutButton = this.root.getByRole('button', { name: 'Checkout' })
    this.subtotal = this.root.getByTestId('cart-summary-subtotal')
    this.total = this.root.getByTestId('cart-summary-total')
  }

  getItem(productName: string) {
    return this.root.getByRole('article').filter({
      has: this.page.getByRole('heading', { name: productName }),
    })
  }

  async incrementQuantity(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: new RegExp(`^Increase quantity of ${productName}\\.`) })
      .click()
  }

  async decrementQuantity(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: new RegExp(`^Decrease quantity of ${productName}\\.`) })
      .click()
  }

  async removeItem(productName: string) {
    await this.getItem(productName)
      .getByRole('button', { name: `Remove ${productName} from cart` })
      .click()
  }

  async getQuantity(productName: string) {
    const quantity = await this.getItem(productName).getByTestId('cart-item-quantity').textContent()

    return Number(quantity)
  }
}

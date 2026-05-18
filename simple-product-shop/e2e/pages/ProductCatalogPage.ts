import type { Locator, Page } from '@playwright/test'

export class ProductCatalogPage {
  readonly page: Page
  readonly root: Locator
  readonly productHeading: Locator
  readonly productCards: Locator

  constructor(page: Page) {
    this.page = page
    this.productHeading = page.getByRole('heading', { name: 'Products' })
    this.root = page.locator('section').filter({ has: this.productHeading })
    this.productCards = this.root.getByRole('article')
  }

  async goto() {
    await this.page.goto('/')
  }

  getProduct(name: string) {
    return this.productCards.filter({
      has: this.page.getByRole('heading', { name }),
    })
  }

  async addToCart(name: string) {
    await this.getProduct(name).getByRole('button').click()
  }
}

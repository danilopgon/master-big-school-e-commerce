export const BUSINESS_RULES = {
  bulkDiscount: {
    minimumQuantity: 5,
    rate: 0.1,
  },
  orderDiscount: {
    minimumSubtotal: 100,
    rate: 0.15,
  },
  quantity: {
    minimum: 1,
    maximum: 99,
    step: 1,
  },
} as const

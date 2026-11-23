export const wooAddItemEndpoint = '/wp-json/wc/store/v1/cart/add-item'

export interface WooCartAttribute { attribute: string; value: string }
export interface WooAddItem {
  id: number
  quantity: number
  variation?: WooCartAttribute[]
}

interface Currency {
  currency_code: string
  currency_minor_unit: number
}

export interface WooCartItem {
  key: string
  id: number
  name: string
  quantity: number
  variation: WooCartAttribute[]
  images: { src: string; alt?: string }[]
  prices: Currency & { price: string }
  totals: Currency & { line_total: string }
}

export interface WooCartSnapshot {
  items: WooCartItem[]
  items_count: number
  totals: Currency & { total_items: string; total_price: string }
}

export interface WooPurchaseSource {
  type?: string
  is_in_stock?: boolean
  is_purchasable?: boolean
  sold_individually?: boolean
  add_to_cart?: { minimum?: number; maximum?: number; multiple_of?: number }
}

export function purchaseRules(product: WooPurchaseSource) {
  const limits = product.add_to_cart
  const minimum = limits?.minimum ?? 1
  const maximum = product.sold_individually ? 1 : limits?.maximum ?? 9999
  const step = limits?.multiple_of ?? 1
  return {
    minimum, maximum, step,
    available: (product.type === 'simple' || product.type === 'variation')
      && product.is_purchasable === true && product.is_in_stock === true,
  }
}
export type PurchaseRules = ReturnType<typeof purchaseRules>

export function validWooQuantity(quantity: number, rules: PurchaseRules) {
  return Number.isSafeInteger(quantity) && quantity > 0
    && quantity >= rules.minimum && quantity <= rules.maximum
    && quantity % rules.step === 0
}

export function formatWooCartMoney(amount: string, currency: Currency) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: currency.currency_code })
    .format(Number(amount) / 10 ** currency.currency_minor_unit)
}

export const wooCartEndpoint = '/wp-json/wc/store/v1/cart'
export const wooAddItemEndpoint = `${wooCartEndpoint}/add-item`

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
  quantity_limits?: { minimum: number; maximum: number; multiple_of: number; editable: boolean }
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

export async function readWooCartResponse(response: Response): Promise<WooCartSnapshot> {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(typeof data?.message === 'string' ? data.message : 'No pudimos actualizar el carrito.')
  }
  if (!Array.isArray(data?.items) || !Number.isSafeInteger(data.items_count) || !data.totals) {
    throw new Error('WooCommerce devolvió un carrito inválido.')
  }
  return { items: data.items, items_count: data.items_count, totals: data.totals }
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

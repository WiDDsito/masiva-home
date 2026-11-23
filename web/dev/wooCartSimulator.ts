import { createHash } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { resolveWooVariation, variationGroup, variationValues } from '../src/content/wooVariations'
import type { WooAttribute, WooVariationDefinition } from '../src/content/wooVariations'
import { purchaseRules, validWooQuantity, wooAddItemEndpoint } from '../src/lib/wooCart'
import type { WooAddItem, WooCartAttribute, WooCartItem, WooCartSnapshot, WooPurchaseSource } from '../src/lib/wooCart'

const publicProducts = 'https://masivahome.com/wp-json/wc/store/v1/products'

interface StoreProduct extends WooPurchaseSource {
  id: number
  name: string
  parent?: number
  images?: WooCartItem['images']
  prices?: WooCartItem['prices']
  attributes?: WooAttribute[]
  variations?: WooVariationDefinition[]
}

class CartRejection extends Error {
  constructor(message: string, readonly status = 400) { super(message) }
}

async function readAddItem(request: IncomingMessage): Promise<WooAddItem> {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 8192) throw new CartRejection('La solicitud supera el tamaño permitido.', 413)
  }

  let data: Partial<WooAddItem> | null
  try { data = JSON.parse(body) } catch { throw new CartRejection('La solicitud del carrito no es válida.') }
  if (!data || typeof data.id !== 'number' || !Number.isSafeInteger(data.id) || data.id < 1
    || typeof data.quantity !== 'number' || !Number.isSafeInteger(data.quantity) || data.quantity < 1) {
    throw new CartRejection('El producto o la cantidad no son válidos.')
  }

  const variation = data.variation
  if (variation !== undefined && (!Array.isArray(variation) || !variation.every(pair => pair
    && typeof pair.attribute === 'string' && pair.attribute && typeof pair.value === 'string' && pair.value))) {
    throw new CartRejection('Los atributos de la variante no son válidos.')
  }
  return { id: data.id, quantity: data.quantity, variation }
}

async function readPublicProduct(id: number) {
  const response = await fetch(`${publicProducts}/${id}`, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(10000) })
  if (response.status === 404) throw new CartRejection('El producto ya no está disponible.')
  if (!response.ok) throw new CartRejection('No pudimos consultar los datos públicos del producto.', 502)
  const product: StoreProduct | null = await response.json()
  if (!product || product.id !== id || typeof product.name !== 'string') {
    throw new CartRejection('WooCommerce devolvió datos inválidos del producto.', 502)
  }
  return product
}

async function cartAttributes(product: StoreProduct, variation: WooCartAttribute[] = []) {
  if (product.type === 'simple' && !variation.length) return { keyAttributes: [], labels: [] }
  const parentId = product.parent
  if (product.type !== 'variation' || !parentId || !Number.isSafeInteger(parentId) || parentId < 1) {
    throw new CartRejection('El producto o la variante no se pueden añadir.')
  }

  const parent = await readPublicProduct(parentId)
  const group = variationGroup(parent.attributes ?? [], parent.variations ?? [])
  const values = new Map(variation.map(pair => [pair.attribute, pair.value]))
  const resolution = resolveWooVariation(group.axes, values, [{ id: product.id, values: variationValues(group, product.id) }])
  if (resolution.status !== 'matched' || variation.length !== group.axes.length) {
    throw new CartRejection('Los atributos elegidos no corresponden a la variante.')
  }

  const keyAttributes: WooCartAttribute[] = []
  const labels: WooCartAttribute[] = []
  for (const axis of group.axes) {
    const term = axis.terms.find(term => term.slug === values.get(axis.key))
    if (!term) throw new CartRejection('Los atributos elegidos no corresponden a la variante.')
    keyAttributes.push({ attribute: axis.key, value: term.slug })
    labels.push({ attribute: axis.name, value: term.name })
  }
  return { keyAttributes, labels }
}

function money(product: StoreProduct) {
  const prices = product.prices
  if (!prices || !/^\d+$/.test(prices.price) || !/^[A-Z]{3}$/.test(prices.currency_code)
    || !Number.isInteger(prices.currency_minor_unit) || prices.currency_minor_unit < 0 || prices.currency_minor_unit > 8) {
    throw new CartRejection('El producto no tiene un precio válido.')
  }
  return { price: prices.price, currency_code: prices.currency_code, currency_minor_unit: prices.currency_minor_unit }
}

function respond(response: ServerResponse, status: number, data: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(data))
}

export function wooCartSimulator(): Plugin {
  const carts = new Map<string, WooCartSnapshot>()

  async function addItem(request: IncomingMessage, response: ServerResponse) {
    try {
      const token = request.headers['cart-token']
      if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token)) {
        throw new CartRejection('La sesión del carrito simulado no es válida.')
      }
      const input = await readAddItem(request)
      const product = await readPublicProduct(input.id)
      const rules = purchaseRules(product)
      if (!rules.available || !validWooQuantity(input.quantity, rules)) {
        throw new CartRejection('El producto o la cantidad solicitada ya no están disponibles.')
      }

      const prices = money(product)
      const { currency_code, currency_minor_unit } = prices
      const { keyAttributes, labels } = await cartAttributes(product, input.variation)
      const previous = carts.get(token)
      if (previous && (previous.totals.currency_code !== currency_code || previous.totals.currency_minor_unit !== currency_minor_unit)) {
        throw new CartRejection('El carrito simulado admite una sola moneda.')
      }

      const items = previous?.items ?? []
      const alreadyInCart = items.reduce((total, item) => total + (item.id === product.id ? item.quantity : 0), 0)
      if (alreadyInCart + input.quantity > rules.maximum) {
        throw new CartRejection(`La cantidad acumulada supera el máximo de ${rules.maximum} unidades.`, 409)
      }

      const key = createHash('sha256').update(JSON.stringify([product.id, keyAttributes])).digest('hex')
      const quantity = (items.find(item => item.key === key)?.quantity ?? 0) + input.quantity
      const line: WooCartItem = {
        key, quantity, id: product.id, name: product.name, prices,
        variation: labels, images: product.images ?? [],
        totals: { currency_code, currency_minor_unit, line_total: String(BigInt(prices.price) * BigInt(quantity)) },
      }
      const next = items.some(item => item.key === key) ? items.map(item => item.key === key ? line : item) : [...items, line]
      const total = String(next.reduce((sum, item) => sum + BigInt(item.totals.line_total), 0n))
      const cart: WooCartSnapshot = {
        items: next,
        items_count: next.reduce((sum, item) => sum + item.quantity, 0),
        totals: { currency_code, currency_minor_unit, total_items: total, total_price: total },
      }
      carts.set(token, cart)
      respond(response, 200, cart)
    } catch (error) {
      const status = error instanceof CartRejection ? error.status : 502
      const message = error instanceof CartRejection ? error.message : 'No pudimos completar la operación del carrito simulado.'
      respond(response, status, { code: 'masiva_cart_simulation_error', message, data: { status } })
    }
  }

  return {
    name: 'masiva-woo-cart-simulator',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?', 1)[0] !== wooAddItemEndpoint) return next()
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'POST')
          return respond(response, 405, { code: 'method_not_allowed', message: 'Usa POST para añadir un artículo.' })
        }
        void addItem(request, response)
      })
    },
  }
}

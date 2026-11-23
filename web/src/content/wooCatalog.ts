import { catalogFilterCategories } from './catalogFilters'
import { purchaseRules } from '../lib/wooCart'
import type { WooPurchaseSource } from '../lib/wooCart'
import { variationGroup, variationValues } from './wooVariations'
import type { VariationGroup, WooAttribute, WooVariationDefinition } from './wooVariations'

const productsEndpoint = '/wp-json/wc/store/v1/products'

interface WooImage {
  src?: string
  alt?: string
}

interface WooProduct extends WooPurchaseSource {
  id: number
  name: string
  parent?: number
  attributes?: WooAttribute[]
  variations?: WooVariationDefinition[]
  images?: WooImage[]
  is_on_backorder?: boolean
  stock_availability?: { text?: string }
  prices?: {
    price: string
    currency_code: string
    currency_minor_unit: number
    price_range?: { min_amount: string; max_amount: string } | null
  }
}

interface WooCategory {
  id: number
  name: string
  slug: string
}

const categoryAliases: Record<string, string> = {
  escritorio: 'oficina',
  'bancos-de-bar': 'banco-de-bar-2',
  'comodas-cajoneras': 'comodas-2',
  'counters-recibidores': 'counters-2',
  'mesas-consola': 'mesas-consolas-2',
  'casas-mascotas': 'pet-house',
}

function normalizeCategory(name: string) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
}

export async function loadWooCategoryFilters(signal: AbortSignal) {
  const response = await fetch(`${productsEndpoint}/categories?hide_empty=false`, {
    signal,
    credentials: 'omit',
  })
  const categories = await readCollection<WooCategory>(response)
  const filters = new Map<string, number>()

  for (const filter of catalogFilterCategories) {
    const term = categories.find(category => category.slug === (categoryAliases[filter.id] ?? filter.id))
      ?? categories.find(category => normalizeCategory(category.name) === normalizeCategory(filter.name))
    if (term) filters.set(filter.id, term.id)
  }

  return filters
}

async function readCollection<Item>(response: Response): Promise<Item[]> {
  if (!response.ok) throw new Error(`WooCommerce respondió con HTTP ${response.status}`)
  const data: unknown = await response.json()
  if (!Array.isArray(data)) throw new Error('Se esperaba una lista de WooCommerce')
  return data
}

function paginationHeader(response: Response, header: string) {
  const value = response.headers.get(header)
  const number = value !== null && /^\d+$/.test(value) ? Number(value) : NaN
  if (!Number.isSafeInteger(number)) throw new Error(`Falta un encabezado válido de paginación: ${header}`)
  return number
}

function formatPrice(prices: WooProduct['prices'], value: unknown) {
  if (!prices || typeof value !== 'string' || !/^\d+$/.test(value.trim())) return undefined
  if (!Number.isInteger(prices.currency_minor_unit) || prices.currency_minor_unit < 0) return undefined
  if (!/^[A-Z]{3}$/.test(prices.currency_code)) return undefined

  const divisor = 10 ** prices.currency_minor_unit
  const amount = Number(value) / divisor
  if (!Number.isFinite(divisor) || !Number.isFinite(amount)) return undefined

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: prices.currency_code,
  }).format(amount)
}

function catalogImage(image: WooImage | undefined, name: string) {
  return image?.src ? { src: image.src, alt: image.alt?.trim() || name } : undefined
}

function productPrice(product: WooProduct, showRange = false) {
  const { prices } = product
  if (showRange && prices?.price_range) {
    const min = formatPrice(prices, prices.price_range.min_amount)
    const max = formatPrice(prices, prices.price_range.max_amount)
    if (min && max) return min === max ? min : `${min} – ${max}`
  }
  return formatPrice(prices, prices?.price) ?? 'Precio no disponible'
}

function productAvailability(product: WooProduct) {
  const text = product.stock_availability?.text?.trim()
  if (text) return text
  if (product.is_on_backorder) return 'Disponible bajo pedido'
  if (product.is_in_stock === true) return 'En stock'
  if (product.is_in_stock === false) return 'Agotado'
  return 'Disponibilidad no informada'
}

function toCatalogCard(product: WooProduct) {
  return {
    id: product.id,
    name: product.name,
    image: catalogImage(product.images?.[0], product.name),
    priceLabel: productPrice(product),
  }
}

export async function loadWooProducts(query: string, signal: AbortSignal) {
  const response = await fetch(`${productsEndpoint}?${query}`, { signal, credentials: 'omit' })
  const products = await readCollection<WooProduct>(response)
  return {
    cards: products.map(toCatalogCard),
    total: paginationHeader(response, 'X-WP-Total'),
    totalPages: paginationHeader(response, 'X-WP-TotalPages'),
  }
}

function productPhotos(product: WooProduct) {
  return (product.images ?? []).flatMap(image => {
    const photo = catalogImage(image, product.name)
    return photo ? [photo] : []
  })
}

export async function loadWooProduct(id: number, signal: AbortSignal) {
  const response = await fetch(`${productsEndpoint}/${id}`, { signal, credentials: 'omit' })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`WooCommerce respondió con HTTP ${response.status}`)

  const product: WooProduct | null = await response.json()
  if (!product || product.id !== id || typeof product.name !== 'string' || !product.name.trim()) {
    throw new Error('WooCommerce devolvió una ficha inválida')
  }

  return {
    id: product.id,
    name: product.name,
    photos: productPhotos(product),
    variationGroup: product.type === 'variable'
      ? variationGroup(product.attributes ?? [], product.variations ?? [])
      : undefined,
    priceLabel: productPrice(product, true),
    availability: productAvailability(product),
    purchase: purchaseRules(product),
  }
}

function toWooVariation(product: WooProduct, group: VariationGroup) {
  return {
    id: product.id,
    values: variationValues(group, product.id),
    photos: productPhotos(product),
    priceLabel: productPrice(product),
    availability: productAvailability(product),
    purchase: purchaseRules(product),
  }
}

export async function loadWooVariations(parent: number, group: VariationGroup, signal: AbortSignal) {
  const variants = new Map<number, ReturnType<typeof toWooVariation>>()
  const query = new URLSearchParams({ type: 'variation', parent: String(parent), per_page: '100', orderby: 'id', order: 'asc' })
  for (const stock of ['instock', 'outofstock', 'onbackorder']) query.append('stock_status[]', stock)

  let totalPages = 1
  let total = 0
  for (let page = 1; page <= totalPages; page += 1) {
    query.set('page', String(page))
    const response = await fetch(`${productsEndpoint}?${query}`, { signal, credentials: 'omit' })
    const products = await readCollection<WooProduct>(response)
    if (page === 1) {
      totalPages = paginationHeader(response, 'X-WP-TotalPages')
      total = paginationHeader(response, 'X-WP-Total')
    }
    for (const product of products) {
      if (product.type !== 'variation' || product.parent !== parent || !Number.isSafeInteger(product.id)) {
        throw new Error('WooCommerce devolvió una variante inválida')
      }
      variants.set(product.id, toWooVariation(product, group))
    }
  }
  if (variants.size !== total) throw new Error('La lista de variantes de WooCommerce está incompleta')
  return variants
}

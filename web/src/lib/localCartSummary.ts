import { products } from '../content/demo'
import type { CartLine } from './cart'

const productsById = new Map(products.map(product => [product.id, product]))

// Las selecciones guardadas pueden contener modelos retirados. Solo se cotizan
// los que siguen en el catálogo local. WooCommerce calcula sus importes aparte.
export function localCartSummary(lines: CartLine[]) {
  const items = lines.flatMap(line => {
    const product = productsById.get(line.id)
    return product ? [{ ...line, product }] : []
  })
  // Redondear el precio unitario en céntimos mantiene el mismo subtotal en ambas vistas.
  const cents = items.reduce((sum, { product, quantity }) =>
    sum + Math.round(product.price * 100) * quantity, 0)
  return { items, subtotal: cents / 100 }
}

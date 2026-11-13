import type { DemoProduct } from '../content/demo'
import { CatalogPreview } from './CatalogPreview'

/** Home and catalogue share the same product gallery and motion. */
export function ProductDetails({ product, onClose }: { product: DemoProduct; onClose: () => void }) {
  return <CatalogPreview product={product} onClose={onClose} closeLabel="Cerrar detalles del producto" />
}

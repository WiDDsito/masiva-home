import { useEffect, useRef } from 'react'
import type { DemoProduct } from '../content/demo'
import { useCart } from '../lib/CartContext'
import { formatPEN } from '../lib/format'
import { Button } from './Button'

export function ProductDetails({ product, onClose }: { product: DemoProduct; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { add } = useCart()
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    element.showModal()
    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { element.close(); document.documentElement.style.overflow = overflow }
  }, [])
  return <dialog ref={dialog} className="product-details" aria-labelledby={`details-${product.id}`} onCancel={event => { event.preventDefault(); onClose() }} data-lenis-prevent>
    <button className="icon-btn product-details__close" autoFocus type="button" aria-label="Cerrar detalles del producto" onClick={onClose}>×</button>
    <div className="product-details__grid">
      <img className="product-details__image" src={product.image} alt={product.name} style={{ viewTransitionName: `product-${product.id}` }} />
      <div className="product-details__body">
        <h2 id={`details-${product.id}`}>{product.name}</h2>
        <p>{product.color}</p>
        <p className="product-details__price">{formatPEN(product.price)}</p>
        <dl><div><dt>Medidas (largo × alto × fondo)</dt><dd>{product.dimensions}</dd></div><div><dt>SKU</dt><dd>{product.model}</dd></div></dl>
        <p className="product__availability">Disponibilidad y entrega por confirmar.</p>
        <Button ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => { add(product.id); onClose() }}>Agregar al carrito</Button>
      </div>
    </div>
  </dialog>
}

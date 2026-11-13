import type { DemoProduct } from '../content/demo'
import { catalogFinishes } from '../content/catalogMedia'
import { formatPEN } from '../lib/format'
import { useCartActions } from '../lib/CartContext'
import { Button } from './Button'

export function CatalogCard({ product, onPreview }: { product: DemoProduct; onPreview: (product: DemoProduct, trigger: HTMLButtonElement) => void }) {
  const { add } = useCartActions()
  const finishes = catalogFinishes(product)
  return <article className="catalog-card">
    <button className="catalog-card__photo" type="button" aria-label={`Vista rápida de ${product.name}`} aria-haspopup="dialog" onClick={event => onPreview(product, event.currentTarget)}>
      <img src={finishes[0].photos[0]?.src} alt={product.name} width="600" height="600" loading="lazy" decoding="async" />
      <span className="catalog-card__quick">Vista rápida <span aria-hidden="true">↗</span></span>
    </button>
    <div className="catalog-card__info"><h2><button type="button" onClick={event => onPreview(product, event.currentTarget)}>{product.name}</button></h2><p>{finishes.length > 1 ? `${finishes.length} acabados disponibles` : product.color}</p><strong>{product.price > 0 ? formatPEN(product.price) : 'Precio por confirmar'}</strong></div>
    {product.price > 0 ? <Button variant="ghost" ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => add(product.id)}>Agregar al carrito</Button> : <button className="catalog-card__consult" type="button" onClick={event => onPreview(product, event.currentTarget)}>Ver detalles y acabados</button>}
  </article>
}

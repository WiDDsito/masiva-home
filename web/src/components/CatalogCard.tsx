import type { ReactNode } from 'react'
import type { DemoProduct } from '../content/demo'
import { catalogFinishes } from '../content/catalogMedia'
import { formatPEN } from '../lib/format'
import { useCartActions } from '../lib/CartContext'
import { Button } from './Button'

type CatalogCardLayoutProps = {
  name: string
  image?: { src: string; alt: string }
  priceLabel: string
  detail?: string
  heading?: 'h2' | 'h3'
} & (
  | { href: string; onPreview?: never; action?: never }
  | { href?: never; onPreview?: (trigger: HTMLButtonElement) => void; action?: ReactNode }
)

export function CatalogCardLayout({ name, image, priceLabel, detail, heading: Heading = 'h2', href, onPreview, action }: CatalogCardLayoutProps) {
  const photo = image && <img src={image.src} alt={image.alt} width="600" height="600" loading="lazy" decoding="async" />
  const content = <>
    {onPreview ? (
      <button className="catalog-card__photo" type="button" aria-label={`Vista rápida de ${name}`} aria-haspopup="dialog" onClick={event => onPreview(event.currentTarget)}>
        {photo}
        <span className="catalog-card__quick">Vista rápida <span aria-hidden="true">↗</span></span>
      </button>
    ) : photo && <div className="catalog-card__photo">{photo}</div>}
    <div className="catalog-card__info">
      <Heading>{onPreview ? <button type="button" onClick={event => onPreview(event.currentTarget)}>{name}</button> : name}</Heading>
      {detail && <p>{detail}</p>}
      <strong>{priceLabel}</strong>
    </div>
  </>

  return href ? (
    <article className="catalog-card catalog-card--linked">
      <a className="catalog-card__link" href={href} aria-label={`Ver producto: ${name}`}>
        {content}
        <span className="btn btn--ghost">Ver producto</span>
      </a>
    </article>
  ) : <article className="catalog-card">{content}{action}</article>
}

export function CatalogCard({ product, onPreview }: { product: DemoProduct; onPreview: (product: DemoProduct, trigger: HTMLButtonElement) => void }) {
  const { add } = useCartActions()
  const finishes = catalogFinishes(product)
  const cover = finishes[0].photos[0]?.src
  const openPreview = (trigger: HTMLButtonElement) => onPreview(product, trigger)

  return <CatalogCardLayout
    name={product.name}
    image={cover ? { src: cover, alt: product.name } : undefined}
    detail={finishes.length > 1 ? `${finishes.length} acabados disponibles` : product.color}
    priceLabel={product.price > 0 ? formatPEN(product.price) : 'Precio por confirmar'}
    onPreview={openPreview}
    action={product.price > 0
      ? <Button variant="ghost" ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => add(product.id)}>Agregar al carrito</Button>
      : <button className="catalog-card__consult" type="button" onClick={event => openPreview(event.currentTarget)}>Ver detalles y acabados</button>}
  />
}

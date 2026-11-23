import { useEffect, useRef, useState } from 'react'
import type { DemoProduct } from '../content/demo'
import { contact } from '../content/demo'
import { catalogFinishes } from '../content/catalogMedia'
import { useCartActions } from '../lib/CartContext'
import { formatPEN } from '../lib/format'
import { Button } from './Button'
import { ProductGallery } from './ProductGallery'

export function CatalogPreview({ product, onClose, closeLabel = 'Cerrar vista rápida' }: { product: DemoProduct; onClose: () => void; closeLabel?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const [finish, setFinish] = useState(0)
  const [photo, setPhoto] = useState(0)
  const { add } = useCartActions()
  const finishes = catalogFinishes(product)
  const selection = finishes[finish]
  const priced = product.price > 0
  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { element.close(); document.documentElement.style.overflow = overflow }
  }, [])
  const requestClose = async () => {
    if (closing.current) return
    closing.current = true
    const element = dialog.current
    if (element && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof element.animate === 'function') {
      const style = getComputedStyle(element)
      const from = { opacity: style.opacity, transform: style.transform }
      element.getAnimations().forEach(animation => animation.cancel())
      element.dataset.closing = 'true'
      await element.animate([from, { opacity: 0, transform: 'translateY(10px) scale(.985)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => undefined)
    }
    onClose()
  }
  return <dialog ref={dialog} className="catalog-preview" aria-labelledby="catalog-preview-title" data-lenis-prevent onCancel={event => { event.preventDefault(); void requestClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) void requestClose()
  }}>
    <button autoFocus type="button" className="icon-btn catalog-preview__close" aria-label={closeLabel} onClick={() => void requestClose()}>×</button>
    <div className="catalog-preview__layout">
      <ProductGallery selected={photo} onSelect={setPhoto} photos={selection.photos.map(photo => ({
        src: photo.src,
        alt: `${product.name}, ${selection.name}. ${photo.label}`,
        label: photo.label,
      }))} />
      <div className="catalog-preview__body">
        <p className="catalog-preview__subtitle">Vista rápida</p>
        <h2 id="catalog-preview-title">{product.name}</h2>
        <p className="catalog-preview__price">{priced ? formatPEN(product.price) : 'Precio por confirmar'}</p>
        {finishes.length > 1 ? <fieldset className="catalog-preview__finishes"><legend>Acabado: {selection.name}</legend>{finishes.map((item, index) => <button key={item.name} type="button" aria-label={item.name} aria-pressed={finish === index} onClick={() => { setFinish(index); setPhoto(0) }}><img src={item.photos[0]?.src} alt="" width="56" height="56" /><span>{item.name}</span></button>)}</fieldset> : <p>{selection.name}</p>}
        <dl><div><dt>Medidas (largo × alto × fondo)</dt><dd>{product.dimensions}</dd></div>{product.model !== 'Por confirmar' && <div><dt>SKU</dt><dd>{product.model}</dd></div>}</dl>
        <p className="catalog-preview__availability">Disponibilidad y entrega por confirmar.</p>
        {priced ? <Button ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => { if (closing.current) return; add(product.id); void requestClose() }}>Agregar al carrito</Button> : <Button href={`https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, quisiera consultar el precio de ${product.name}, acabado ${selection.name}.`)}`} external>Consultar precio</Button>}
      </div>
    </div>
  </dialog>
}

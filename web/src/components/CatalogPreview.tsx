import { useEffect, useRef, useState } from 'react'
import type { DemoProduct } from '../content/demo'
import { contact } from '../content/demo'
import { catalogFinishes } from '../content/catalogMedia'
import { useCart } from '../lib/CartContext'
import { formatPEN } from '../lib/format'
import { Button } from './Button'

export function CatalogPreview({ product, onClose }: { product: DemoProduct; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [finish, setFinish] = useState(0)
  const [photo, setPhoto] = useState(0)
  const { add } = useCart()
  const finishes = catalogFinishes(product)
  const selection = finishes[finish]
  const image = selection.photos[photo]
  const priced = product.price > 0
  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { element.close(); document.documentElement.style.overflow = overflow }
  }, [])
  return <dialog ref={dialog} className="catalog-preview" aria-labelledby="catalog-preview-title" data-lenis-prevent onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
  }}>
    <button autoFocus type="button" className="icon-btn catalog-preview__close" aria-label="Cerrar vista rápida" onClick={onClose}>×</button>
    <div className="catalog-preview__layout">
      <div className="catalog-preview__gallery">
        <div className="catalog-preview__stage">{image && <img className="catalog-preview__image" src={image.src} alt={`${product.name}, ${selection.name}. ${image.label}`} width="800" height="800" decoding="async" />}</div>
        <div className="catalog-preview__thumbnails" aria-label="Fotografías del producto">
          {selection.photos.map((item, index) => <button type="button" key={item.src} aria-label={`Ver foto ${index + 1}: ${item.label}`} aria-pressed={index === photo} onClick={() => setPhoto(index)}><img src={item.src} alt="" width="72" height="72" loading="lazy" /></button>)}
        </div>
      </div>
      <div className="catalog-preview__body">
        <p className="catalog-preview__subtitle">Vista rápida</p>
        <h2 id="catalog-preview-title">{product.name}</h2>
        <p className="catalog-preview__price">{priced ? formatPEN(product.price) : 'Precio por confirmar'}</p>
        {finishes.length > 1 ? <fieldset className="catalog-preview__finishes"><legend>Acabado: {selection.name}</legend>{finishes.map((item, index) => <button key={item.name} type="button" aria-label={item.name} aria-pressed={finish === index} onClick={() => { setFinish(index); setPhoto(0) }}><img src={item.photos[0]?.src} alt="" width="56" height="56" /><span>{item.name}</span></button>)}</fieldset> : <p>{selection.name}</p>}
        <dl><div><dt>Medidas (largo × alto × fondo)</dt><dd>{product.dimensions}</dd></div>{product.model !== 'Por confirmar' && <div><dt>SKU</dt><dd>{product.model}</dd></div>}</dl>
        <p className="catalog-preview__availability">Disponibilidad y entrega por confirmar.</p>
        {priced ? <Button ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => { add(product.id); onClose() }}>Agregar al carrito</Button> : <Button href={`https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, quisiera consultar el precio de ${product.name}, acabado ${selection.name}.`)}`} external>Consultar precio</Button>}
      </div>
    </div>
  </dialog>
}

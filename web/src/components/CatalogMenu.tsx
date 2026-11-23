import { useEffect, useRef, useState } from 'react'
import { categoryPreviewImage } from '../content/images'
import { productFamilies } from '../content/catalogFilters'
import { catalogGroups } from '../content/catalogMedia'

const shortcuts = ['aparadores', 'mesas-de-centro', 'mesas-de-tv', 'roperos', 'escritorios']

export function CatalogMenu({ category, onSelect }: { category: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState('aparadores')
  const root = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const family = productFamilies.find(item => item.id === preview)
  const image = categoryPreviewImage(preview)
  useEffect(() => {
    if (!open) return
    if (window.matchMedia('(max-width: 760px)').matches) root.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  const choose = (id: string) => { onSelect(id); setOpen(false); trigger.current?.focus({ preventScroll: true }) }
  return <nav className="catalog-nav" aria-label="Categorías del catálogo" ref={root} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
  }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false) }}>
    <div className="catalog-nav__bar">
      <button ref={trigger} className="catalog-nav__all" type="button" aria-expanded={open} aria-controls="catalog-categories" onClick={() => setOpen(value => !value)}>
        <span aria-hidden="true">☰</span> Todas las categorías <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div className="catalog-nav__shortcuts">
        {shortcuts.map(id => <button key={id} type="button" aria-pressed={category === id} onClick={() => { onSelect(id); setOpen(false) }}>{productFamilies.find(item => item.id === id)?.name}</button>)}
      </div>
    </div>
    {open && <div className="catalog-menu" id="catalog-categories" data-lenis-prevent>
      <div className="catalog-menu__links">
        {catalogGroups.map(group => <div key={group.name}><h2>{group.name}</h2>{group.ids.map(id => <button type="button" key={id} aria-pressed={category === id} onMouseEnter={() => setPreview(id)} onFocus={() => setPreview(id)} onClick={() => choose(id)}>{productFamilies.find(item => item.id === id)?.name}</button>)}</div>)}
      </div>
      <div className="catalog-menu__preview">
        {image ? <img src={image} alt={family?.name} width="400" height="300" /> : <div className="catalog-menu__placeholder">Encuentra tu próxima pieza</div>}
        <strong>{family?.name}</strong>
        <button type="button" onClick={() => choose(preview)}>Ver categoría <span aria-hidden="true">↗</span></button>
      </div>
    </div>}
  </nav>
}

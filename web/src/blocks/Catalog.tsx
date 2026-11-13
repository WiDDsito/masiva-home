import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { catalogFilterCategories, productFamilyById } from '../content/catalogFilters'
import { products } from '../content/demo'
import type { DemoProduct } from '../content/demo'
import { CatalogCard } from '../components/CatalogCard'
import { CatalogMenu } from '../components/CatalogMenu'
import { CatalogPreview } from '../components/CatalogPreview'
import { Button } from '../components/Button'
import { useCart } from '../lib/CartContext'
import '../styles/catalog.css'

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function catalogQuery() { return new URLSearchParams(window.location.hash.split('?')[1] ?? '') }
function CatalogBagButton() {
  const { count, setOpen } = useCart()
  return <button type="button" className="catalog-page__cart" onClick={() => setOpen(true)}>Ver carrito ({count})</button>
}

export function Catalog({ focusSearch = false, initialCategory = 'all' }: { focusSearch?: boolean; initialCategory?: string }) {
  const [category, setCategory] = useState(catalogFilterCategories.some(item => item.id === initialCategory) ? initialCategory : 'all')
  const [search, setSearch] = useState(() => catalogQuery().get('q') ?? '')
  const [sort, setSort] = useState(() => { const value = catalogQuery().get('orden'); return value === 'price-asc' || value === 'price-desc' ? value : 'featured' })
  const [preview, setPreview] = useState<DemoProduct | null>(null)
  const previewTrigger = useRef<HTMLButtonElement | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  useEffect(() => { if (focusSearch) searchInput.current?.focus() }, [focusSearch])
  useEffect(() => {
    if (!window.location.hash.startsWith('#catalogo')) return
    const query = catalogQuery()
    if (category === 'all') query.delete('categoria'); else query.set('categoria', category)
    if (!search) query.delete('q'); else query.set('q', search)
    if (sort === 'featured') query.delete('orden'); else query.set('orden', sort)
    const next = `#catalogo${query.size ? `?${query}` : ''}`
    if (window.location.hash !== next) window.history.replaceState(window.history.state, '', next)
  }, [category, search, sort])
  useEffect(() => {
    const restore = () => {
      if (!window.location.hash.startsWith('#catalogo')) return
      const query = catalogQuery()
      const requested = query.get('categoria') ?? 'all'
      setCategory(catalogFilterCategories.some(item => item.id === requested) ? requested : 'all')
      setSearch(query.get('q') ?? '')
      const order = query.get('orden')
      setSort(order === 'price-asc' || order === 'price-desc' ? order : 'featured')
    }
    window.addEventListener('hashchange', restore)
    return () => window.removeEventListener('hashchange', restore)
  }, [])
  const filtered = useMemo(() => {
    const query = normalize(search.trim())
    const result = products.filter(product => {
      const family = catalogFilterCategories.find(item => item.id === productFamilyById[product.id])?.name ?? ''
      const room = catalogFilterCategories.find(item => item.id === product.category)?.name ?? ''
      return (category === 'all' || product.category === category || productFamilyById[product.id] === category) && normalize(`${product.name} ${product.model} ${product.color} ${family} ${room}`).includes(query)
    })
    if (sort !== 'featured') result.sort((a, b) => {
      if (!a.price || !b.price) return Number(!a.price) - Number(!b.price)
      return sort === 'price-asc' ? a.price - b.price : b.price - a.price
    })
    return result
  }, [category, search, sort])
  const categoryName = catalogFilterCategories.find(item => item.id === category)?.name
  const clear = () => { setCategory('all'); setSearch('') }
  const selectCategory = (id: string) => { setCategory(id); setSearch('') }
  return <section className="catalog-page" id="catalogo" aria-labelledby="catalogo-title">
    <div className="container">
      <div className="catalog-page__breadcrumb"><a href="#inicio">Inicio</a><span aria-hidden="true">/</span><span>Catálogo</span></div>
      <div className="catalog-page__heading">
        <div><h1 id="catalogo-title">Catálogo de muebles</h1><p>Encuentra la pieza que buscas.</p></div>
        <label className="catalog-page__search"><span className="visually-hidden">Buscar en el catálogo</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input ref={searchInput} id="catalog-search" type="search" name="q" autoComplete="off" spellCheck={false} placeholder="Busca un mueble o SKU…" value={search} onChange={event => setSearch(event.target.value)} /></label>
      </div>
      <CatalogMenu category={category} onSelect={selectCategory} />
      <div className="catalog-page__toolbar">
        <div className="catalog-page__selection"><h2>{categoryName ?? 'Todos los muebles'}</h2><p role="status">{filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}</p></div>
        <div className="catalog-page__filters">
          <label><span className="visually-hidden">Filtrar por categoría</span><select aria-label="Filtrar por categoría" value={category} onChange={event => selectCategory(event.target.value)}><option value="all">Todas las categorías</option>{catalogFilterCategories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label><span className="visually-hidden">Ordenar productos</span><select aria-label="Ordenar productos" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Recomendados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></label>
          <CatalogBagButton />
        </div>
      </div>
      {(category !== 'all' || search) && <div className="catalog-page__active"><span>{search ? `Búsqueda: “${search}”` : categoryName}</span><button type="button" onClick={clear}>Limpiar filtros <span aria-hidden="true">×</span></button></div>}
      {filtered.length ? <div className="catalog-grid">{filtered.map(product => <CatalogCard key={product.id} product={product} onPreview={(item, trigger) => { previewTrigger.current = trigger; setPreview(item) }} />)}</div> : <div className="catalog-page__empty"><h3>{search ? 'No encontramos ese mueble.' : 'Pronto, más piezas en esta categoría.'}</h3><p>{search ? 'Prueba con el nombre del mueble, su modelo o SKU.' : 'Puedes explorar los modelos disponibles o consultarnos por la pieza que buscas.'}</p><Button variant="ghost" onClick={clear}>Ver todos los muebles</Button></div>}
      <p className="catalog-page__note">Precios en soles. Disponibilidad y entrega por confirmar.</p>
    </div>
    {preview && <CatalogPreview key={preview.id} product={preview} onClose={() => { flushSync(() => setPreview(null)); previewTrigger.current?.focus({ preventScroll: true }) }} />}
  </section>
}

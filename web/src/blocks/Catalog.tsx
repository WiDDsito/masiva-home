import { useEffect, useRef, useState } from 'react'
import { catalogFilterCategories } from '../content/catalogFilters'
import { loadWooCategoryFilters, loadWooProducts } from '../content/wooCatalog'
import { CatalogCardLayout } from '../components/CatalogCard'
import { CatalogMenu } from '../components/CatalogMenu'
import { Button } from '../components/Button'
import { useCart } from '../lib/CartContext'
import '../styles/catalog.css'

type SortOrder = 'featured' | 'price-asc' | 'price-desc'

interface CatalogFilters {
  category: string
  search: string
  sort: SortOrder
  page: number
}

type ProductPage = Awaited<ReturnType<typeof loadWooProducts>>
type ProductRequest =
  | { key: string; status: 'error' }
  | { key: string; status: 'ready'; result: ProductPage }

function parseSort(value: string | null): SortOrder {
  return value === 'price-asc' || value === 'price-desc' ? value : 'featured'
}

function readCatalogFilters(initialCategory = 'all'): CatalogFilters {
  const query = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const page = Number(query.get('pagina'))
  return {
    category: query.get('categoria') ?? initialCategory,
    search: query.get('q') ?? '',
    sort: parseSort(query.get('orden')),
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  }
}

function catalogRouteQuery({ category, search, sort, page }: CatalogFilters) {
  const query = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  if (category === 'all') query.delete('categoria'); else query.set('categoria', category)
  if (!search) query.delete('q'); else query.set('q', search)
  if (sort === 'featured') query.delete('orden'); else query.set('orden', sort)
  if (page === 1) query.delete('pagina'); else query.set('pagina', String(page))
  return query.size ? `?${query}` : ''
}

function productQuery({ page, search, sort }: CatalogFilters, categoryId?: number) {
  const query = new URLSearchParams({ page: String(page), per_page: '12' })
  if (categoryId !== undefined) query.set('category', String(categoryId))
  if (search.trim()) query.set('search', search.trim())
  if (sort !== 'featured') {
    query.set('orderby', 'price')
    query.set('order', sort === 'price-asc' ? 'asc' : 'desc')
  }
  return query.toString()
}

function CatalogBagButton() {
  const { count, setOpen } = useCart()
  return <button type="button" className="catalog-page__cart" onClick={() => setOpen(true)}>Ver carrito ({count})</button>
}

export function Catalog({ focusSearch = false, initialCategory = 'all' }: { focusSearch?: boolean; initialCategory?: string }) {
  const [filters, setFilters] = useState(() => readCatalogFilters(initialCategory))
  const [draftSearch, setDraftSearch] = useState(filters.search)
  const [categoryIds, setCategoryIds] = useState<Map<string, number> | 'error' | null>(null)
  const [categoryAttempt, setCategoryAttempt] = useState(0)
  const [productAttempt, setProductAttempt] = useState(0)
  const [request, setRequest] = useState<ProductRequest | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const { category, search, sort, page } = filters
  const catalogQuery = catalogRouteQuery(filters)

  const categoryId = categoryIds instanceof Map ? categoryIds.get(category) : undefined
  const query = category === 'all' || categoryId !== undefined ? productQuery(filters, categoryId) : null
  const requestKey = query === null ? null : `${query}:${productAttempt}`
  const current = request?.key === requestKey ? request : null
  const result = current?.status === 'ready' ? current.result : null
  const updating = query !== null && !current && request?.status === 'ready'
  const displayed = result ?? (updating && request?.status === 'ready' ? request.result : null)
  const categoryName = catalogFilterCategories.find(item => item.id === category)?.name
  const categoryError = category !== 'all' && categoryIds === 'error'
  const unmatched = category !== 'all' && categoryIds instanceof Map && categoryId === undefined
  const isLoading = !categoryError && !unmatched && current === null && !updating

  useEffect(() => {
    if (draftSearch === search) return
    const timer = window.setTimeout(() => {
      setFilters(previous => ({ ...previous, search: draftSearch, page: 1 }))
    }, 300)
    return () => window.clearTimeout(timer)
  }, [draftSearch, search])

  useEffect(() => { if (focusSearch) searchInput.current?.focus() }, [focusSearch])
  useEffect(() => {
    if (!window.location.hash.startsWith('#catalogo')) return
    const next = `#catalogo${catalogQuery}`
    if (window.location.hash !== next) window.history.replaceState(window.history.state, '', next)
  }, [catalogQuery])
  useEffect(() => {
    const restore = () => {
      if (window.location.hash.startsWith('#catalogo')) {
        const restored = readCatalogFilters()
        setDraftSearch(restored.search)
        setFilters(restored)
      }
    }
    window.addEventListener('hashchange', restore)
    return () => window.removeEventListener('hashchange', restore)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadWooCategoryFilters(controller.signal).then(ids => {
      if (!controller.signal.aborted) setCategoryIds(ids)
    }).catch(() => {
      if (!controller.signal.aborted) setCategoryIds('error')
    })
    return () => controller.abort()
  }, [categoryAttempt])

  useEffect(() => {
    if (query === null || requestKey === null) return
    const controller = new AbortController()
    void loadWooProducts(query, controller.signal).then(result => {
      if (!controller.signal.aborted) setRequest({ key: requestKey, status: 'ready', result })
    }).catch(() => {
      if (!controller.signal.aborted) setRequest({ key: requestKey, status: 'error' })
    })
    return () => controller.abort()
  }, [query, requestKey])

  const clear = () => selectCategory('all')
  const selectCategory = (id: string) => {
    setDraftSearch('')
    setFilters(current => ({ ...current, category: id, search: '', page: 1 }))
  }
  const retry = () => {
    if (categoryError) {
      setCategoryIds(null)
      setCategoryAttempt(attempt => attempt + 1)
    } else {
      setProductAttempt(attempt => attempt + 1)
    }
  }
  const goToPage = (next: number) => setFilters(current => ({ ...current, page: next }))

  return <section className="catalog-page" id="catalogo" aria-labelledby="catalogo-title">
    <div className="container">
      <div className="catalog-page__breadcrumb"><a href="#inicio">Inicio</a><span aria-hidden="true">/</span><span>Catálogo</span></div>
      <div className="catalog-page__heading">
        <div><h1 id="catalogo-title">Catálogo de muebles</h1><p>Encuentra la pieza que buscas.</p></div>
        <label className="catalog-page__search"><span className="visually-hidden">Buscar en el catálogo</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input ref={searchInput} id="catalog-search" type="search" name="q" autoComplete="off" spellCheck={false} placeholder="Busca un mueble o SKU…" value={draftSearch} onChange={event => setDraftSearch(event.target.value)} /></label>
      </div>
      <CatalogMenu category={category} onSelect={selectCategory} />
      <div className="catalog-page__toolbar">
        <div className="catalog-page__selection">
          <h2>{category === 'all' ? 'Todos los muebles' : categoryName ?? 'Categoría del catálogo'}</h2>
          {result && <p role="status">{result.total} {result.total === 1 ? 'producto' : 'productos'}</p>}
        </div>
        <div className="catalog-page__filters">
          <label>
            <span className="visually-hidden">Filtrar por categoría</span>
            <select aria-label="Filtrar por categoría" value={category} onChange={event => selectCategory(event.target.value)}>
              <option value="all">Todas las categorías</option>
              {category !== 'all' && !categoryName && <option value={category}>Categoría seleccionada</option>}
              {catalogFilterCategories.map(item => <option key={item.id} value={item.id}>{item.name}{categoryIds instanceof Map && !categoryIds.has(item.id) ? ' (sin equivalencia)' : ''}</option>)}
            </select>
          </label>
          <label>
            <span className="visually-hidden">Ordenar productos</span>
            <select aria-label="Ordenar productos" value={sort} onChange={event => {
              const value = parseSort(event.target.value)
              setFilters(current => ({ ...current, sort: value, page: 1 }))
            }}>
              <option value="featured">Más recientes</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option>
            </select>
          </label>
          <CatalogBagButton />
        </div>
      </div>
      {(category !== 'all' || search) && <div className="catalog-page__active"><span>{search ? `Búsqueda: “${search}”` : categoryName}</span><button type="button" onClick={clear}>Limpiar filtros <span aria-hidden="true">×</span></button></div>}
      {updating && <p role="status">Actualizando resultados…</p>}
      {isLoading ? <div className="catalog-page__empty" role="status">Cargando catálogo de WooCommerce…</div>
        : categoryError || current?.status === 'error' ? <div className="catalog-page__empty">
          <p role="alert">{categoryError ? 'No pudimos cargar las categorías de WooCommerce.' : 'No pudimos cargar los productos de WooCommerce.'}</p>
          <Button variant="ghost" onClick={retry}>Volver a intentar</Button>
        </div>
        : unmatched ? <div className="catalog-page__empty"><p role="status">Este filtro no tiene una categoría equivalente en WooCommerce.</p></div>
        : displayed?.cards.length ? <div className="catalog-grid" aria-busy={updating}>{displayed.cards.map(({ id, ...card }) => <CatalogCardLayout
          key={id}
          {...card}
          heading="h3"
          href={`#producto/${id}${catalogQuery}`}
        />)}</div>
        : updating ? null : <div className="catalog-page__empty">
          <h3>{search ? 'No encontramos ese mueble.' : 'No encontramos productos.'}</h3>
          {page > 1 ? <Button variant="ghost" onClick={() => goToPage(1)}>Volver a la primera página</Button>
            : (category !== 'all' || search) && <Button variant="ghost" onClick={clear}>Ver todos los muebles</Button>}
        </div>}
      {result && result.totalPages > 1 && page <= result.totalPages && <nav className="catalog-page__pagination" aria-label="Paginación del catálogo">
        <button className="btn btn--ghost" type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>Anterior</button>
        <span>Página {page} de {result.totalPages}</span>
        <button className="btn btn--ghost" type="button" disabled={page >= result.totalPages} onClick={() => goToPage(page + 1)}>Siguiente</button>
      </nav>}
      <p className="catalog-page__note">Precios en soles. Disponibilidad y entrega por confirmar.</p>
    </div>
  </section>
}

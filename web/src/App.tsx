import { transitionView } from './lib/viewTransition'
import { useEffect, useRef, useState } from 'react'
import { Catalog } from './blocks/Catalog'
import { Checkout } from './blocks/Checkout'
import './styles/home.css'
import { WooProductDetails } from './blocks/WooProductDetails'
import { CartProvider } from './lib/CartContext'
import { Cart } from './components/Cart'
import { Contact } from './blocks/Contact'
import { Footer } from './blocks/Footer'
import { CheckoutHeader, Header } from './blocks/Header'
import { Help } from './blocks/Help'
import { Hero } from './blocks/Hero'
import { Services } from './blocks/Services'
import { Shop } from './blocks/Shop'
import { Showroom } from './blocks/Showroom'
import { useScrollAnimations } from './lib/useScrollAnimations'

function isCatalogHash(hash: string) {
  return hash === '#catalogo' || hash.startsWith('#catalogo?')
}
function pageFor(hash: string) {
  if (isCatalogHash(hash)) return 'catalog'
  if (hash.startsWith('#producto/')) return 'product'
  if (hash === '#finalizar-compra') return 'checkout'
  return hash === '#ayuda' || hash.startsWith('#ayuda?') ? 'help' : 'home'
}

function catalogParams(hash: string) {
  const query = hash.slice('#catalogo'.length)
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : '')
  return {
    focusSearch: params.has('buscar'),
    category: params.get('categoria') ?? 'all',
  }
}

export function App() {
  const [hash, setHash] = useState(window.location.hash)
  const catalogTransition = useRef<'showroom-catalog' | undefined>(undefined)
  const isCatalog = isCatalogHash(hash)
  const page = pageFor(hash)
  const [productId = '', catalogQuery = ''] = page === 'product' ? hash.slice('#producto/'.length).split('?', 2) : []
  const numericId = Number(productId)
  const wooProductId = /^[1-9]\d*$/.test(productId) && Number.isSafeInteger(numericId) ? numericId : null
  const catalogHref = catalogQuery ? `#catalogo?${catalogQuery}` : '#catalogo'
  const helpTopic = page === 'help' ? new URLSearchParams(hash.split('?')[1]).get('tema') ?? 'preguntas' : ''
  const params = isCatalog ? catalogParams(hash) : { focusSearch: false, category: 'all' }
  useScrollAnimations(page !== 'home')

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash
      const nextPage = pageFor(next)
      const variant = catalogTransition.current
      catalogTransition.current = undefined
      if (nextPage !== page) transitionView(() => setHash(next), () => {
        if (nextPage !== 'home') window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }, variant ?? (nextPage === 'help' || page === 'help' ? 'showroom-catalog' : undefined))
      else setHash(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [page])

  useEffect(() => {
    document.title = page === 'checkout' ? 'Finalizar compra | Masiva Home' : isCatalog ? 'Catálogo completo | Masiva Home' : page === 'product' ? 'Ficha del producto | Masiva Home' : page === 'help' ? 'Ayuda para tu compra | Masiva Home' : 'Masiva Home — Muebles que transforman tu hogar'
    const frame = requestAnimationFrame(() => {
      if (page === 'help' || page === 'product' || page === 'checkout') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.getElementById('contenido')?.focus({ preventScroll: true })
      } else if (isCatalog) {
        window.scrollTo(0, 0)
        if (!window.location.hash.includes('buscar')) document.getElementById('contenido')?.focus({ preventScroll: true })
      } else {
        const destination = window.location.hash.slice(1)
        if (!destination) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        else document.getElementById(destination)?.scrollIntoView({ block: 'start' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [isCatalog, page, helpTopic, productId])

  return (
    <CartProvider>
      <a className="skip-link" href="#contenido" onClick={page === 'checkout' ? event => {
        event.preventDefault()
        document.getElementById('contenido')?.focus()
      } : undefined}>
        Saltar al contenido
      </a>

      {page === 'checkout' ? <CheckoutHeader /> : <Header onSearchNavigate={() => {
        const search = document.querySelector<HTMLInputElement>('#catalog-search')
        if (search) {
          search.focus({ preventScroll: true })
          search.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        } else {
          catalogTransition.current = 'showroom-catalog'
          window.location.hash = '#catalogo?buscar'
        }
      }} onCatalogNavigate={id => {
        catalogTransition.current = id === 'all' ? 'showroom-catalog' : undefined
        window.location.hash = id === 'all' ? '#catalogo' : `#catalogo?categoria=${id}`
      }} />}

      <main id="contenido" tabIndex={-1} className={page === 'home' ? 'page-view home-page' : 'page-view'} onClickCapture={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const link = (event.target as Element).closest('a[href^="#catalogo"]')
        catalogTransition.current = link?.closest('#showroom, #tienda .shop__catalog-link, #servicios .services__actions') ? 'showroom-catalog' : undefined
      }}>
        {isCatalog ? (
          <Catalog key={params.category} focusSearch={params.focusSearch} initialCategory={params.category} />
        ) : page === 'product' ? (
          <WooProductDetails key={productId} id={wooProductId} catalogHref={catalogHref} />
        ) : page === 'checkout' ? <Checkout /> : page === 'help' ? <Help topic={helpTopic} /> : (
          <>
            <Hero />
            <Shop />
            <Showroom />
            <Services />
            <Contact />
          </>
        )}
      </main>

      <Footer />
      <Cart />
    </CartProvider>
  )
}

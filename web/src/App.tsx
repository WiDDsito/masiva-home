import { transitionView } from './lib/viewTransition'
import { useEffect, useRef, useState } from 'react'
import { Catalog } from './blocks/Catalog'
import { CartProvider } from './lib/CartContext'
import { Cart } from './components/Cart'
import { Contact } from './blocks/Contact'
import { Footer } from './blocks/Footer'
import { Header } from './blocks/Header'
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
  return isCatalogHash(hash) ? 'catalog' : hash === '#ayuda' || hash.startsWith('#ayuda?') ? 'help' : 'home'
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
  const helpTopic = page === 'help' ? new URLSearchParams(hash.split('?')[1]).get('tema') ?? 'preguntas' : ''
  const params = isCatalog ? catalogParams(hash) : { focusSearch: false, category: 'all' }
  useScrollAnimations(page !== 'home')

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash
      const nextCatalog = isCatalogHash(next)
      const variant = catalogTransition.current
      catalogTransition.current = undefined
      if (pageFor(next) !== page) transitionView(() => setHash(next), () => {
        if (nextCatalog || pageFor(next) === 'help') window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }, variant ?? (pageFor(next) === 'help' || page === 'help' ? 'showroom-catalog' : undefined))
      else setHash(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [page])

  useEffect(() => {
    document.title = isCatalog ? 'Catálogo completo | Masiva Home' : page === 'help' ? 'Ayuda para tu compra | Masiva Home' : 'Masiva Home — Muebles que transforman tu hogar'
    const frame = requestAnimationFrame(() => {
      if (page === 'help') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.getElementById('contenido')?.focus({ preventScroll: true })
      } else if (isCatalog) {
        window.scrollTo(0, 0)
        if (!window.location.hash.includes('buscar')) document.getElementById('contenido')?.focus({ preventScroll: true })
      } else {
        const destination = window.location.hash.slice(1)
        if (!destination || destination === 'inicio') window.scrollTo(0, 0)
        else document.getElementById(destination)?.scrollIntoView({ behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [isCatalog, page, helpTopic])

  return (
    <CartProvider>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <Header onSearchNavigate={() => {
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
      }} />

      <main id="contenido" tabIndex={-1} className="page-view" onClickCapture={event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const link = (event.target as Element).closest('a[href^="#catalogo"]')
        catalogTransition.current = link?.closest('#showroom, #tienda .shop__catalog-link') ? 'showroom-catalog' : undefined
      }}>
        {isCatalog ? (
          <Catalog key={params.category} focusSearch={params.focusSearch} initialCategory={params.category} />
        ) : page === 'help' ? <Help topic={helpTopic} /> : (
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

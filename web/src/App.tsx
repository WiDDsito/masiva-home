import { transitionView } from './lib/viewTransition'
import { useEffect, useState } from 'react'
import { Catalog } from './blocks/Catalog'
import { CartProvider } from './lib/CartContext'
import { Cart } from './components/Cart'
import { Contact } from './blocks/Contact'
import { Footer } from './blocks/Footer'
import { Header } from './blocks/Header'
import { Hero } from './blocks/Hero'
import { Services } from './blocks/Services'
import { Shop } from './blocks/Shop'
import { Showroom } from './blocks/Showroom'
import { useScrollAnimations } from './lib/useScrollAnimations'

function isCatalogHash(hash: string) {
  return hash === '#catalogo' || hash.startsWith('#catalogo?')
}

function catalogParams(hash: string) {
  const query = hash.slice('#catalogo'.length)
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : '')
  return {
    focusSearch: query.includes('buscar'),
    category: params.get('categoria') ?? 'all',
  }
}

export function App() {
  const [hash, setHash] = useState(window.location.hash)
  const isCatalog = isCatalogHash(hash)
  const params = isCatalog ? catalogParams(hash) : { focusSearch: false, category: 'all' }
  useScrollAnimations(isCatalog)

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash
      const nextCatalog = isCatalogHash(next)
      if (nextCatalog !== isCatalog) transitionView(() => setHash(next), () => {
        if (nextCatalog) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      })
      else setHash(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [isCatalog])

  useEffect(() => {
    document.title = isCatalog ? 'Catálogo completo | Masiva Home' : 'Masiva Home — Muebles que transforman tu hogar'
    const frame = requestAnimationFrame(() => {
      if (isCatalog) {
        window.scrollTo(0, 0)
        if (!window.location.hash.includes('buscar')) document.getElementById('contenido')?.focus({ preventScroll: true })
      } else {
        const destination = window.location.hash.slice(1)
        if (!destination || destination === 'inicio') window.scrollTo(0, 0)
        else document.getElementById(destination)?.scrollIntoView({ behavior: 'instant' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [isCatalog])

  return (
    <CartProvider>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <Header />

      <main id="contenido" tabIndex={-1} className="page-view">
        {isCatalog ? (
          <Catalog key={params.category} focusSearch={params.focusSearch} initialCategory={params.category} />
        ) : (
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

import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { products } from '../content/demo'
import { loadWooFeaturedProducts } from '../content/wooCatalog'
import { CatalogCardLayout } from '../components/CatalogCard'
import { useCart } from '../lib/CartContext'
import '../styles/catalog.css'

function WooFeaturedProducts() {
  const [cards, setCards] = useState<Awaited<ReturnType<typeof loadWooFeaturedProducts>> | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    void loadWooFeaturedProducts(controller.signal).then(result => {
      if (!controller.signal.aborted) setCards(result)
    }).catch(() => {
      if (!controller.signal.aborted) setCards([])
    })
    return () => controller.abort()
  }, [])

  if (!cards?.length) return <p className="shop__note" role="status">
    {cards ? 'Consulta los productos disponibles en el catálogo.' : 'Cargando productos destacados…'}
  </p>
  return <div className="products products--preview">
    {cards.map(({ id, ...card }) => <CatalogCardLayout
      key={id} {...card} heading="h3" href={`#producto/${id}`} />)}
  </div>
}

export function Shop() {
  const { wooCheckoutUrl } = useCart()
  return (
    <section className="section section--top-tight" id="tienda" aria-labelledby="tienda-title">
      <div className="container">
        <div className="section__head" data-reveal>
          <h2 className="section__title" id="tienda-title">
            Tienda
          </h2>
          <p className="section__lead">
            Muebles que acompañan tu forma de vivir. Explora por ambiente o llega directo a la
            pieza que buscas.
          </p>
        </div>

        {wooCheckoutUrl ? <WooFeaturedProducts /> : <div className="products products--preview">
          {products.slice(0, 2).map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 90} />
          ))}
        </div>}

        <div className="shop__catalog-link">
          <Button href="#catalogo">Ver catálogo completo</Button>
        </div>

        <p className="shop__note">Precios en soles. Disponibilidad y entrega sujetas a confirmación.</p>
      </div>
    </section>
  )
}

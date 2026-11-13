import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { products } from '../content/demo'

export function Shop() {
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

        <div className="products products--preview">
          {products.slice(0, 2).map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 90} />
          ))}
        </div>

        <div className="shop__catalog-link">
          <Button href="#catalogo">Ver catálogo completo</Button>
        </div>

        <p className="shop__note">Precios en soles. Disponibilidad y entrega sujetas a confirmación.</p>
      </div>
    </section>
  )
}

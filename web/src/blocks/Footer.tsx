import type { CSSProperties } from 'react'
import { categories, contact, IS_DEMO } from '../content/demo'
import { images } from '../content/images'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand" data-reveal>
            <a className="brand" href="#inicio" aria-label="Masiva Home, ir al inicio">
              <img className="footer__logo" src={images.logo} alt="Masiva Home" />
            </a>
            <p className="footer__note">
              Muebles funcionales fabricados en Lima. Diseño propio y atención directa, sin
              intermediarios.
            </p>
          </div>

          <nav aria-labelledby="footer-tienda" data-reveal style={{ '--reveal-delay': '60ms' } as CSSProperties}>
            <h2 className="footer__heading" id="footer-tienda">
              Tienda
            </h2>
            <ul className="footer__list">
              {categories.map((category) => (
                <li key={category.id}>
                  <a href={`#catalogo?categoria=${category.id}`}>{category.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            aria-labelledby="footer-marca"
            data-reveal
            style={{ '--reveal-delay': '120ms' } as CSSProperties}
          >
            <h2 className="footer__heading" id="footer-marca">
              Masiva Home
            </h2>
            <ul className="footer__list">
              <li>
                <a href="#inicio">Inicio</a>
              </li>
              <li>
                <a href="#showroom">Showroom</a>
              </li>
              <li>
                <a href="#servicios">Servicios</a>
              </li>
              <li>
                <a href="#servicios">Fabricación propia</a>
              </li>
            </ul>
          </nav>

          <nav
            aria-labelledby="footer-ayuda"
            data-reveal
            style={{ '--reveal-delay': '180ms' } as CSSProperties}
          >
            <h2 className="footer__heading" id="footer-ayuda">
              Ayuda
            </h2>
            <ul className="footer__list">
              <li>
                <a href="#contacto">Contacto</a>
              </li>
              <li>
                <a href="#ayuda?tema=preguntas">Preguntas frecuentes</a>
              </li>
              <li>
                <a href="#ayuda?tema=entrega">Entrega y recojo</a>
              </li>
              <li>
                <a href="#ayuda?tema=garantia">Garantía</a>
              </li>
            </ul>
          </nav>

          <nav
            aria-labelledby="footer-legal"
            data-reveal
            style={{ '--reveal-delay': '240ms' } as CSSProperties}
          >
            <h2 className="footer__heading" id="footer-legal">
              Legal
            </h2>
            <ul className="footer__list">
              <li>
                <a href={`${contact.whatsapp.split('?')[0]}?text=${encodeURIComponent('Hola, quisiera consultar la política de privacidad de Masiva Home.')}`} target="_blank" rel="noopener noreferrer">Consultar privacidad</a>
              </li>
              <li>
                <a href={`${contact.whatsapp.split('?')[0]}?text=${encodeURIComponent('Hola, quisiera consultar los términos y condiciones de Masiva Home.')}`} target="_blank" rel="noopener noreferrer">Consultar términos y condiciones</a>
              </li>
              <li>
                <span>Libro de reclamaciones (por publicar)</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Masiva Home. Todos los derechos reservados.</span>
          <span>Lima, Perú · Atención personalizada para tu compra.</span>
          {IS_DEMO && (
            <span className="footer__demo" role="note">
              Vista local: selección parcial con precios de Carga General. Disponibilidad, entrega y pago en línea por confirmar.
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}

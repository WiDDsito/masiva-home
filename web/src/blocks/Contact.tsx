import { SplitText } from '../components/SplitText'
import type { CSSProperties } from 'react'
import { Button } from '../components/Button'
import { contact } from '../content/demo'

export function Contact() {
  return (
    <section className="section" id="contacto" aria-labelledby="contacto-title">
      <div className="container contact__grid">
        <div data-reveal>
          <h2 className="contact__title" id="contacto-title"><SplitText text="Hablemos de tu espacio." /></h2>
          <p className="contact__lead">
            Si no sabes qué medida te conviene o quieres cotizar varias piezas, escríbenos. Te
            responde una persona, no un formulario.
          </p>
          <div className="contact__actions">
            <Button href={contact.whatsapp} external>
              Escribir por WhatsApp
            </Button>
            <Button variant="ghost" href={contact.phoneHref}>
              Llamar
            </Button>
          </div>
        </div>

        <dl className="contact__list" data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
          <div className="contact__item">
            <dt className="contact__label">WhatsApp y teléfono</dt>
            <dd className="contact__value">
              <a href={contact.phoneHref}>{contact.phone}</a>
            </dd>
          </div>
          <div className="contact__item">
            <dt className="contact__label">Correo</dt>
            <dd className="contact__value">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </dd>
          </div>
          <div className="contact__item">
            <dt className="contact__label">Ubicación</dt>
            <dd className="contact__value">{contact.city}</dd>
          </div>
          <div className="contact__item">
            <dt className="contact__label">Horario de atención</dt>
            <dd className="contact__value">Por confirmar</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

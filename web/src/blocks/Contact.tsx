import { useState } from 'react'
import type { FormEvent } from 'react'
import { SplitText } from '../components/SplitText'
import { Button } from '../components/Button'
import { contact } from '../content/demo'
import falabella from '../../assets/retail/falabella.jpeg'
import sodimac from '../../assets/retail/sodimac.png'
import promart from '../../assets/retail/promart.png'
import oechsle from '../../assets/retail/oechsle.webp'
import plazaVea from '../../assets/retail/plaza-vea.jpg'

const plazaVeaUrl = 'https://www.plazavea.com.pe/search/?_query=masiva%20home'
const retailers = [
  { name: 'Falabella', image: falabella, href: 'https://www.falabella.com.pe/falabella-pe/seller/MASIVA%20HOME' },
  { name: 'Sodimac', image: sodimac, href: 'https://www.sodimac.com.pe/sodimac-pe/marca/MASIVA%20HOME' },
  { name: 'Promart', image: promart, href: 'https://www.promart.pe/search?_query=MASIVA%20HOME', className: 'contact__retail-link--promart' },
  { name: 'Oechsle', image: oechsle, href: plazaVeaUrl },
  { name: 'Plaza Vea', image: plazaVea, href: plazaVeaUrl, className: 'contact__retail-link--plaza-vea' },
]

export function Contact() {
  const [draft, setDraft] = useState('')

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const value = (name: string) => String(fields.get(name) ?? '').trim()
    const info = [`Nombre: ${value('firstName')} ${value('lastName')}`, `Correo: ${value('email')}`]
    const phone = value('phone')
    if (phone) info.push(`Teléfono: ${phone}`)
    const body = [info.join('\n'), value('message')].join('\n\n')
    setDraft(`mailto:${contact.email}?subject=${encodeURIComponent(value('subject'))}&body=${encodeURIComponent(body)}`)
  }

  return (
    <section className="section" id="contacto" aria-labelledby="contacto-title">
      <div className="container">
        <div className="contact__grid">
          <div data-reveal>
            <h2 className="contact__title" id="contacto-title"><SplitText text="Hablemos de tu espacio" /></h2>
            <p className="contact__lead">Cuéntanos qué mueble buscas, comparte las medidas de tu espacio o solicita una cotización.</p>
            <div className="contact__actions">
              <Button href={contact.whatsapp} external>Escribir por WhatsApp</Button>
              <Button variant="ghost" href={contact.phoneHref}>Llamar</Button>
            </div>
            <dl className="contact__list">
              <div className="contact__item"><dt className="contact__label">WhatsApp y teléfono</dt><dd className="contact__value"><a href={contact.phoneHref}>{contact.phone}</a></dd></div>
              <div className="contact__item"><dt className="contact__label">Correo</dt><dd className="contact__value"><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
              <div className="contact__item"><dt className="contact__label">Ubicación</dt><dd className="contact__value">{contact.city}</dd></div>
              <div className="contact__item"><dt className="contact__label">Horario de atención</dt><dd className="contact__value">Lunes a sábado, de 9:00 a. m. a 6:00 p. m.</dd></div>
            </dl>
          </div>

          <form className="contact__form" aria-labelledby="contacto-form-title" aria-describedby="contacto-form-help" onSubmit={prepareMessage} onChange={() => setDraft('')}>
            <h3 id="contacto-form-title">Cuéntanos sobre tu proyecto</h3>
            <p id="contacto-form-help">Prepara el mensaje para enviarlo desde tu aplicación de correo.</p>
            <div className="contact__fields">
              <label>Nombre<input name="firstName" autoComplete="given-name" required maxLength={70} /></label>
              <label>Apellido<input name="lastName" autoComplete="family-name" required maxLength={70} /></label>
              <label>Correo electrónico<input name="email" type="email" autoComplete="email" required maxLength={150} /></label>
              <label>Teléfono (opcional)<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
              <label className="contact__field--wide">Asunto<input name="subject" required maxLength={120} /></label>
              <label className="contact__field--wide">Mensaje<textarea name="message" rows={4} required maxLength={1200} /></label>
            </div>
            <div className="contact__submit">
              <Button type="submit">Preparar correo</Button>
              <div aria-live="polite">{draft && <a className="link" href={draft}>Abrir borrador de correo</a>}</div>
            </div>
          </form>
        </div>

        <section className="contact__retail" aria-labelledby="contacto-marketplaces">
          <h3 id="contacto-marketplaces">También encuéntranos en</h3>
          <ul className="contact__retail-list">
            {retailers.map(({ name, image, href, className }) => (
              <li key={name}>
                <a className={`contact__retail-link${className ? ` ${className}` : ''}`} href={href} target="_blank" rel="noopener noreferrer">
                  <img src={image} alt={name} loading="lazy" width="128" height="56" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}

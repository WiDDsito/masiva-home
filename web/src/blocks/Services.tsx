import { useEffect, useRef, useState } from 'react'
import { images } from '../content/images'
import { SplitText } from '../components/SplitText'
import type { CSSProperties, PointerEvent } from 'react'
import { contact, services } from '../content/demo'
import { Button } from '../components/Button'

const storyImages = [images.escanor, images.fabela, images.kevin, images.yoshi]
export function Services() {
  const [step, setStep] = useState(0)
  const grid = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      const candidates = Array.from(grid.current?.querySelectorAll<HTMLElement>('[data-step]') ?? []).map(element => {
        const rect = element.getBoundingClientRect()
        return { index: Number(element.dataset.step), top: rect.top, bottom: rect.bottom, distance: Math.abs(rect.top + rect.height / 2 - window.innerHeight * .45) }
      }).filter(item => item.bottom > 100 && item.top < window.innerHeight * .9).sort((a, b) => a.distance - b.distance)
      if (candidates[0]) setStep(candidates[0].index)
    }, { rootMargin: '-20% 0px -35% 0px', threshold: [0, .25, .5, .75, 1] })
    grid.current?.querySelectorAll('[data-step]').forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])
  const setBubbleOrigin = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget
    const rect = box.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))
    box.style.setProperty('--bubble-x', `${x}px`)
    box.style.setProperty('--bubble-y', `${y}px`)
    box.style.setProperty('--bubble-size', `${Math.ceil(radius * 2)}px`)
  }
  return (
    <section
      className="section section--screen"
      id="servicios"
      aria-labelledby="servicios-title"
    >
      <div className="container">
        <div className="section__head" data-reveal>
          <h2 className="section__title" id="servicios-title"><SplitText text="Servicios" /></h2>
          <p className="section__lead">
            Encuentra apoyo para diseñar tu espacio, personalizar tus muebles y coordinar
            su entrega e instalación.
          </p>
          <div className="services__actions">
            <Button href={`${contact.whatsapp.split('?')[0]}?text=${encodeURIComponent('Hola, quisiera cotizar un proyecto de diseño de interiores o muebles personalizados.')}`} external>Cotizar mi proyecto</Button>
            <Button href="#catalogo" variant="ghost">Explorar catálogo</Button>
          </div>
        </div>

        <div className="services-layout">
        <aside className="services-story" aria-label="Servicios para tu espacio">
          <div className="services-story__media">{storyImages.map((src, index) => <img key={src} src={src} alt={index === step ? 'Mueble de la colección Masiva Home' : ''} aria-hidden={index !== step} loading="lazy" className={index === step ? 'is-active' : ''} />)}</div>
          <div className="services-story__progress" aria-hidden="true">{services.map((_, index) => <span key={index} className={index <= step ? 'is-active' : ''} />)}</div>
          <p className="services-story__title" aria-live="polite">{services[step].title}</p>
          <p>De elegir tu pieza a encontrarle su lugar.</p>
        </aside>
        <div className="bento" ref={grid}>
          {services.map((service, index) => (
            <article
              className={`bento__cell ${service.accent ? 'bento__cell--accent' : ''}`.trim()}
              data-step={index}
              key={service.title}
              onPointerEnter={setBubbleOrigin}
              data-reveal
              style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
            >
              <h3 className="bento__title">{service.title}</h3>
              <p className="bento__text">{service.text}</p>
            </article>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}

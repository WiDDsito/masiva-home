import { SplitText } from '../components/SplitText'
import { Button } from '../components/Button'
import { Cota } from '../components/Cota'
import { HeroVideo } from '../components/HeroVideo'
import { claims, contact } from '../content/demo'
import { useEffect, useState } from 'react'

let heroVisited = false

export function Hero() {
  const [entering, setEntering] = useState(() => !heroVisited && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    heroVisited = true
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => { if (preference.matches) setEntering(false) }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])
  return (
    <section className={`hero ${entering ? 'hero--entering' : ''}`} id="inicio" aria-labelledby="hero-title" onAnimationEnd={event => { if (event.animationName === 'hero-media-enter') setEntering(false) }}>
      <HeroVideo />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <h1 className="hero__title" id="hero-title">
          <span className="hero__line">
            <span className="hero__line-inner"><SplitText text="Muebles que transforman" /></span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner"><SplitText text="tu hogar." /></span>
          </span>
        </h1>
        <p className="hero__lead">
          Diseño funcional, fabricación propia y precio directo. Piezas pensadas para el uso
          diario, hechas en Lima.
        </p>

        <div className="hero__actions">
            <Button href="#tienda">Ver tienda</Button>
          <Button variant="ghost" href={contact.whatsapp} external>
            Cotizar por WhatsApp
          </Button>
        </div>

        <Cota className="hero__cota" value="130 × 100 × 35 cm" label="Largo × alto × fondo del aparador" />

        <div className="hero__claims">
          {claims.map((claim) => (
            <p className="claim" key={claim.title}>
              <strong>{claim.title}</strong>
              {claim.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

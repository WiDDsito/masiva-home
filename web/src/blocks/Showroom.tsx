import { Button } from '../components/Button'
import { useCartActions } from '../lib/CartContext'
import { formatPEN } from '../lib/format'
import { products } from '../content/demo'
import { Magnetic } from '../components/Magnetic'
import { rooms, showroomPieces as pieces } from '../content/showroom'
import type { RoomId } from '../content/showroom'
import { SplitText } from '../components/SplitText'
import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useInView } from '../lib/useInView'

const Showroom3D = lazy(() => import('../three/Showroom3D'))


class ShowroomBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onUnavailable() }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function Showroom() {
  const { add } = useCartActions()
  const [active, setActive] = useState<string | null>(null)
  const [room, setRoom] = useState<RoomId>('sala')
  const [pan, setPan] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const showPhotos = useCallback(() => { setUnavailable(true); setRotate(false); setPan(false) }, [])
  const selectPiece = (name: string | null) => {
    const selected = pieces.find(p => p.name === name)
    if (!name) setActive(null)
    else if (selected) { setRoom(selected.room); setActive(current => current === name ? null : name); setRotate(false) }
  }
  const selectRoom = (id: RoomId) => { setRoom(id); setActive(null); setZoom(1) }
  const [rotate, setRotate] = useState(false)
  const [inViewport, setInViewport] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [zoom, setZoom] = useState(1)
  const [reset, setReset] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const { ref, visible } = useInView<HTMLElement>('300px')
  const piece = pieces.find(p => p.name === active)
  const product = products.find(p => p.id === piece?.productId)
  const visiblePieces = pieces.filter(p => p.room === room)
  const photoProduct = product ?? products.find(item => item.id === visiblePieces[0]?.productId)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting))
    if (stage.current) observer.observe(stage.current)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return (
    <section ref={ref} className="showroom on-dark" id="showroom" aria-labelledby="showroom-title" onKeyDown={event => { if (event.key === 'Escape') setActive(null) }}>
      <div className="container showroom__intro">
        <h2 id="showroom-title"><SplitText text="Dale espacio a tus ideas." /></h2>
        <p>{unavailable ? 'Elige un ambiente y consulta sus muebles en fotografías.' : 'Un showroom para explorar con calma. Elige una pieza y descubre otra perspectiva.'}</p>
      </div>
      <div className={`showroom__experience ${unavailable ? 'showroom__experience--photos' : ''}`}>
        <div className="showroom__stage" id="room-viewport" role="tabpanel" aria-labelledby={`room-tab-${room}`} ref={stage} aria-label="Visor de muebles en 3D" aria-describedby="showroom-help">
          {unavailable ? <div className="showroom__photos">
            <img src={photoProduct?.image} alt={`Fotografía del catálogo: ${photoProduct?.name ?? rooms[room].label}`} width="1000" height="800" />
            <div className="showroom__photo-note"><p role="status">La vista 3D no está disponible. Puedes explorar las fotografías del catálogo.</p><a className="link" href={`#catalogo?categoria=${room}`}>Ver fotos y medidas</a></div>
          </div> : visible && <ShowroomBoundary onUnavailable={showPhotos}><Suspense fallback={<span className="showroom__loading" role="status">Preparando el showroom…</span>}>
            <Showroom3D room={room} pan={pan} active={active} onSelect={selectPiece} running={inViewport && pageVisible} rotate={rotate} reset={reset} zoom={zoom} onUnavailable={showPhotos} />
          </Suspense></ShowroomBoundary>}
          <p className="showroom__hint" id="showroom-help">{unavailable ? 'Elige un producto para ver su fotografía, precio y medidas.' : 'Pulsa + para explorar un mueble · Arrastra para girar'}</p>
        </div>
        {(!unavailable || product) && <div id="showroom-product" className={`showroom__caption ${product ? 'has-selection' : ''}`} key={active ?? room} aria-live="polite">
          {product && <img className="showroom__reference" src={product.image} alt={`Fotografía de referencia de ${product.name}`} />}
          <h3>{product?.name ?? rooms[room].description}</h3>
          <p>{piece?.detail ?? 'Selecciona un mueble para acercarte. Vuelve a pulsarlo o elige Vista general para regresar.'}</p>
          {product && <>
            <p className="showroom__material">{product.dimensions} · {product.color}</p>
            <div className="showroom__purchase">
              <p className="showroom__price">{formatPEN(product.price)}</p>
              <Button ariaLabel={`Agregar ${product.name} al carrito`} onClick={() => add(product.id)}>Agregar al carrito</Button>
              <p className="showroom__availability">Disponibilidad y entrega por confirmar.</p>
            </div>
          </>}
        </div>}
      </div>
      <div className="container showroom__rooms" role="tablist" aria-label="Ambientes del showroom">
        {(Object.keys(rooms) as RoomId[]).map((id, index, list) => <Magnetic key={id}><button type="button" role="tab" id={`room-tab-${id}`} aria-selected={room === id} tabIndex={room === id ? 0 : -1} aria-controls="room-viewport" onClick={() => selectRoom(id)} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length
          selectRoom(list[next]); event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus()
        }}>{rooms[id].label}</button></Magnetic>)}
      </div>
      <div className="container showroom__toolbar">
        <div className="showroom__legend" role="group" aria-label={`Productos de ${rooms[room].label}`}>
          {visiblePieces.map(p => <Magnetic key={p.name}><button type="button" aria-pressed={active === p.name} className={active === p.name ? 'is-active' : ''} onClick={() => selectPiece(p.name)}>{p.name}</button></Magnetic>)}
        </div>
        {!unavailable && <div className="showroom__tools">
          <button type="button" aria-pressed={active === null} onClick={() => selectPiece(null)}>Vista general</button>
          <button type="button" aria-pressed={rotate} onClick={() => setRotate(v => !v)} aria-label={rotate ? 'Pausar giro automático' : 'Activar giro automático'}>{rotate ? 'Pausar giro' : 'Giro automático'}</button>
          <button type="button" aria-pressed={pan} onClick={() => setPan(v => !v)}>Desplazar</button>
          <button type="button" aria-label="Acercar mueble" disabled={zoom >= 1.8} onClick={() => setZoom(v => Math.min(1.8, v + .2))}>+</button>
          <button type="button" aria-label="Alejar mueble" disabled={zoom <= .8} onClick={() => setZoom(v => Math.max(.8, v - .2))}>−</button>
          <button type="button" onClick={() => { setZoom(1); setActive(null); setPan(false); setReset(v => v + 1) }}>Restablecer vista</button>
        </div>}
        <Magnetic><a className="link" href="#catalogo">Explorar el catálogo</a></Magnetic>
      </div>
      <p className="container showroom__disclaimer">{unavailable ? 'Fotografías de referencia del catálogo. Consulta la ficha y confirma los detalles antes de comprar.' : 'Reconstrucciones 3D basadas en las fotografías y medidas del catálogo. Algunos detalles no visibles en las fotos son aproximados; consulta la ficha antes de comprar.'}</p>
    </section>
  )
}

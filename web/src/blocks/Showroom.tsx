import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Magnetic } from '../components/Magnetic'
import { SplitText } from '../components/SplitText'
import { products } from '../content/demo'
import { rooms, showroomCatalogHref, showroomPieces } from '../content/showroom'
import type { RoomId } from '../content/showroom'
import { useInView } from '../lib/useInView'

const Showroom3D = lazy(() => import('../three/Showroom3D'))
const roomIds = Object.keys(rooms) as RoomId[]

class ShowroomBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onUnavailable() }
  render() { return this.state.failed ? null : this.props.children }
}

export function Showroom() {
  const [room, setRoom] = useState<RoomId>('sala')
  const [active, setActive] = useState<string | null>(null)
  const [pan, setPan] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [rotate, setRotate] = useState(false)
  const [inViewport, setInViewport] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [zoom, setZoom] = useState(1)
  const [reset, setReset] = useState(0)
  const stage = useRef<HTMLDivElement>(null)
  const { ref, visible } = useInView<HTMLElement>('300px')
  const showFallback = useCallback(() => { setUnavailable(true); setRotate(false); setPan(false) }, [])
  const visiblePieces = showroomPieces.filter(piece => piece.room === room)
  const selected = visiblePieces.find(piece => piece.name === active)
  const selectPiece = (name: string) => { setActive(current => current === name ? null : name); setRotate(false) }
  const selectRoom = (id: RoomId) => { setRoom(id); setActive(null); setZoom(1) }
  const selectedProduct = products.find(product => product.id === selected?.productId)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting))
    if (stage.current) observer.observe(stage.current)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return (
    <section ref={ref} className="showroom on-dark" id="showroom" aria-labelledby="showroom-title" onKeyDown={event => {
      if (event.key !== 'Escape' || !selected) return
      const marker = stage.current?.querySelector<HTMLButtonElement>(`[data-product-id="${selected.productId}"]`)
      setActive(null)
      marker?.focus({ preventScroll: true })
    }}>
      <div className="container">
        <div className="showroom__intro">
          <h2 id="showroom-title"><SplitText text="Dale espacio a tus ideas." /></h2>
          <p>Explora tres ambientes en 3D, desde la sala hasta el dormitorio.</p>
        </div>
        <div className="showroom__controls">
          <div className="showroom__rooms" role="tablist" aria-label="Ambientes del showroom">
            {roomIds.map((id, index) => <Magnetic key={id}><button type="button" role="tab" id={`room-tab-${id}`} aria-selected={room === id} tabIndex={room === id ? 0 : -1} aria-controls="room-viewport" onClick={() => selectRoom(id)} onKeyDown={event => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
              event.preventDefault()
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? roomIds.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + roomIds.length) % roomIds.length
              selectRoom(roomIds[next])
              event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus()
            }}>{rooms[id].label}</button></Magnetic>)}
          </div>
          <div className="showroom__toolbar">
            {!unavailable && <div className="showroom__tools">
              <button type="button" aria-pressed={rotate} onClick={() => setRotate(value => !value)}>{rotate ? 'Pausar giro' : 'Giro automático'}</button>
              <button type="button" aria-pressed={pan} onClick={() => setPan(value => !value)}>Desplazar</button>
              <button type="button" aria-label="Acercar ambiente" disabled={zoom >= 1.8} onClick={() => setZoom(value => Math.min(1.8, value + .2))}>+</button>
              <button type="button" aria-label="Alejar ambiente" disabled={zoom <= .8} onClick={() => setZoom(value => Math.max(.8, value - .2))}>−</button>
              <button type="button" onClick={() => { setZoom(1); setPan(false); setActive(null); setReset(value => value + 1) }}>Restablecer vista</button>
            </div>}
            <Magnetic><a className="link" href="#catalogo">Explorar el catálogo</a></Magnetic>
          </div>
        </div>
      </div>
      <div
        className={selected ? 'showroom__layout showroom__layout--selected' : 'showroom__layout'}
        id="room-viewport"
        role="tabpanel"
        aria-labelledby={`room-tab-${room}`}
        style={{ backgroundColor: rooms[room].background }}
      >
        <div className="showroom__stage" ref={stage}>
          {unavailable ? <div className="showroom__fallback">
            <h3>{rooms[room].label}</h3>
            <p role="status">La vista 3D no está disponible en este dispositivo.</p>
            <div className="showroom__fallback-links">
              {visiblePieces.map(piece => (
                <button className="link" type="button" key={piece.productId} data-product-id={piece.productId} aria-pressed={active === piece.name} aria-controls={active === piece.name ? 'showroom-product' : undefined} onClick={() => selectPiece(piece.name)}>
                  {products.find(product => product.id === piece.productId)?.name ?? piece.name}
                </button>
              ))}
            </div>
          </div> : visible && <ShowroomBoundary onUnavailable={showFallback}><Suspense fallback={<span className="showroom__loading" role="status">Preparando el showroom…</span>}>
            <Showroom3D room={room} active={active} onSelect={selectPiece} pan={pan} running={inViewport && pageVisible} rotate={rotate} reset={reset} zoom={zoom} onUnavailable={showFallback} />
          </Suspense></ShowroomBoundary>}
          {!unavailable && !active && <p className="showroom__hint">Arrastra para girar el ambiente o pulsa + para explorar un mueble.</p>}
        </div>
        {selected && <article id="showroom-product" className="showroom__product-card" aria-labelledby="showroom-product-title">
          {selectedProduct?.image && <img src={selectedProduct.image} alt={selectedProduct.name} width="88" height="88" decoding="async" />}
          <h3 id="showroom-product-title">{selectedProduct?.name ?? selected.name}</h3>
          <p>{selected.detail}</p>
          {selectedProduct && <p className="showroom__product-specs">{selectedProduct.dimensions} · {selectedProduct.color}</p>}
          <p className="showroom__product-price">Ver precio en el catálogo</p>
          <a className="btn btn--primary" href={showroomCatalogHref(selected)}>Buscar en el catálogo</a>
        </article>}
      </div>
    </section>
  )
}

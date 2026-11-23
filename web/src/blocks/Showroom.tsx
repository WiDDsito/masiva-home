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
  const showFallback = useCallback(() => {
    setUnavailable(true)
    setRotate(false)
    setPan(false)
  }, [])
  const visiblePieces = showroomPieces.filter(piece => piece.room === room)
  const selected = visiblePieces.find(piece => piece.productId === active)
  const selectPiece = (productId: string) => {
    setActive(current => current === productId ? null : productId)
    setRotate(false)
  }
  const closeProduct = () => {
    const marker = stage.current?.querySelector<HTMLButtonElement>(`[data-product-id="${selected?.productId}"]`)
    setActive(null)
    marker?.focus({ preventScroll: true })
  }
  const selectRoom = (id: RoomId) => { setRoom(id); setActive(null); setZoom(1) }
  const selectedProduct = products.find(product => product.id === selected?.productId)
  const selectedName = selectedProduct?.name ?? selected?.name
  const selectedImage = selected?.preview?.image ?? selectedProduct?.image
  const selectedSpecs = selected?.preview?.specs ?? (selectedProduct && `${selectedProduct.dimensions} · ${selectedProduct.color}`)

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
      closeProduct()
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
              <button type="button" onClick={() => setActive(null)}>Vista general</button>
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
        className="showroom__layout"
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
                <button className="link" type="button" key={piece.productId} data-product-id={piece.productId} aria-pressed={active === piece.productId} aria-controls={active === piece.productId ? 'showroom-product' : undefined} onClick={() => selectPiece(piece.productId)}>
                  {products.find(product => product.id === piece.productId)?.name ?? piece.name}
                </button>
              ))}
            </div>
          </div> : visible && <ShowroomBoundary onUnavailable={showFallback}><Suspense fallback={<span className="showroom__loading" role="status">Preparando el showroom…</span>}>
            <Showroom3D room={room} active={active} onSelect={selectPiece} pan={pan} running={inViewport && pageVisible} rotate={rotate} reset={reset} zoom={zoom} onUnavailable={showFallback} />
          </Suspense></ShowroomBoundary>}
          {!unavailable && <>
            <div className="showroom__room-copy" aria-hidden={Boolean(selected)}>
              <h3><span>Un espacio para</span>{' '}{rooms[room].titleEnding}</h3>
              <p>Selecciona un mueble para acercarte. Vuelve a pulsarlo o elige Vista general para regresar.</p>
            </div>
            {!selected && <p className="showroom__hint">Pulsa + para explorar un mueble · Arrastra para girar</p>}
          </>}
        </div>
        {selected && <article key={selected.productId} id="showroom-product" className="showroom__product-card" aria-labelledby="showroom-product-title">
          <button className="showroom__product-close" type="button" aria-label="Cerrar tarjeta del producto" onClick={closeProduct}>×</button>
          {selectedImage && <img src={selectedImage} alt={selectedName} width="88" height="88" decoding="async" />}
          <h3 id="showroom-product-title">{selectedName}</h3>
          <p>{selected.detail}</p>
          {selectedSpecs && <p className="showroom__product-specs">{selectedSpecs}</p>}
          <p className="showroom__product-price">Ver precio en el catálogo</p>
          <a className="btn btn--primary" href={showroomCatalogHref(selected)}>Buscar en el catálogo</a>
        </article>}
      </div>
    </section>
  )
}

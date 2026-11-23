import { Html } from '@react-three/drei'
import { showroomPieces } from '../content/showroom'
import type { RoomId } from '../content/showroom'
import { products } from '../content/demo'

type ShowroomPiece = (typeof showroomPieces)[number]
function ShowroomHotspot({ piece, selected, onSelect }: { piece: ShowroomPiece; selected: boolean; onSelect: (productId: string) => void }) {
  const name = products.find(item => item.id === piece.productId)?.name ?? piece.name

  return <Html position={piece.hotspot} center occlude zIndexRange={[16, 8]} style={{ pointerEvents: 'none' }}>
      <button type="button" className="showroom-hotspot" data-product-id={piece.productId} aria-label={`Explorar ${name}`} aria-expanded={selected} aria-pressed={selected} aria-controls={selected ? 'showroom-product' : undefined} onPointerDown={event => event.stopPropagation()} onPointerUp={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); onSelect(piece.productId) }}>
        <span className="showroom-hotspot__symbol" aria-hidden="true">{selected ? '✓' : '+'}</span>
        {!selected && <span className="showroom-hotspot__label" aria-hidden="true">{name}</span>}
      </button>
  </Html>
}

/** DOM buttons follow the furniture in 3D without a continuous animation loop. */
export function ShowroomHotspots({ room, active, onSelect }: { room: RoomId; active: string | null; onSelect: (productId: string) => void }) {
  return <>{showroomPieces.filter(piece => piece.room === room).map(piece => (
    <ShowroomHotspot key={piece.productId} piece={piece} selected={active === piece.productId} onSelect={onSelect} />
  ))}</>
}

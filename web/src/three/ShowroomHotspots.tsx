import { Html } from '@react-three/drei'
import { showroomPieces } from '../content/showroom'
import type { RoomId } from '../content/showroom'
import { products } from '../content/demo'

const positions: Record<string, [number, number, number]> = {
  fabela: [-.3, .6, .3],
  kevin: [.9, .72, -1.4],
  escanor: [-.7, 1.18, -1.4],
  runa: [.75, 1.25, -1.3],
}

type ShowroomPiece = (typeof showroomPieces)[number]
function ShowroomHotspot({ piece, selected, onSelect }: { piece: ShowroomPiece; selected: boolean; onSelect: (name: string) => void }) {
  const name = products.find(item => item.id === piece.productId)?.name ?? piece.name

  return <Html position={positions[piece.productId]} center occlude zIndexRange={[3, 1]} style={{ pointerEvents: 'none' }}>
      <button type="button" className="showroom-hotspot" data-product-id={piece.productId} aria-label={`Explorar ${name}`} aria-expanded={selected} aria-pressed={selected} aria-controls={selected ? 'showroom-product' : undefined} onPointerDown={event => event.stopPropagation()} onPointerUp={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); onSelect(piece.name) }}>
        <span className="showroom-hotspot__symbol" aria-hidden="true">{selected ? '✓' : '+'}</span>
        {!selected && <span className="showroom-hotspot__label" aria-hidden="true">{name}</span>}
      </button>
  </Html>
}

/** DOM buttons follow the furniture in 3D without a continuous animation loop. */
export function ShowroomHotspots({ room, active, onSelect }: { room: RoomId; active: string | null; onSelect: (name: string) => void }) {
  return <>{showroomPieces.filter(piece => piece.room === room).map(piece => (
    <ShowroomHotspot key={piece.productId} piece={piece} selected={active === piece.name} onSelect={onSelect} />
  ))}</>
}

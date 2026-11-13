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

/** DOM buttons follow the furniture in 3D without a continuous animation loop. */
export function ShowroomHotspots({ room, active, onSelect }: { room: RoomId; active: string | null; onSelect: (name: string | null) => void }) {
  return <>{showroomPieces.filter(piece => piece.room === room).map(piece => {
    const product = products.find(item => item.id === piece.productId)!
    const selected = active === piece.name
    return <Html key={piece.productId} position={positions[piece.productId]} center occlude zIndexRange={[3, 1]} style={{ pointerEvents: 'none' }}>
      <button type="button" className="showroom-hotspot" data-product-id={piece.productId} aria-label={`Explorar ${product.name}`} aria-pressed={selected} aria-controls="showroom-product" onPointerDown={event => event.stopPropagation()} onPointerUp={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); onSelect(piece.name) }}>
        <span className="showroom-hotspot__symbol" aria-hidden="true">{selected ? '✓' : '+'}</span>
        <span className="showroom-hotspot__label" aria-hidden="true">{product.name}</span>
      </button>
    </Html>
  })}</>
}

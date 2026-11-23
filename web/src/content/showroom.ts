import { images } from './images'

export type RoomId = 'sala' | 'comedor' | 'dormitorio'
export const rooms: Record<RoomId, { label: string; background: string; camera: [number, number, number]; titleEnding: string }> = {
  sala: { label: 'Sala', background: '#e5e3de', camera: [5.2,3.8,6.8], titleEnding: 'conversar' },
  comedor: { label: 'Comedor', background: '#e9e4db', camera: [4.9,3.5,6.6], titleEnding: 'compartir.' },
  dormitorio: { label: 'Dormitorio', background: '#e0e4e1', camera: [5.2,3.7,6.8], titleEnding: 'descansar.' },
}
type ShowroomPiece = {
  name: string
  room: RoomId
  productId: string
  catalogCategory: string
  catalogSearch?: string
  hotspot: [number, number, number]
  detail: string
  preview?: { image?: string; specs: string }
}

export const showroomPieces: ShowroomPiece[] = [
  {name:'Centro de mesa',room:'sala',productId:'fabela',catalogCategory:'mesas-de-centro',hotspot:[-.3,.6,.3],detail:'Fabela: sobre negro, nicho abierto, cajón lateral y patas negras.'},
  {name:'Mesa de TV',room:'sala',productId:'kevin',catalogCategory:'mesas-de-tv',hotspot:[.9,.72,-1.4],detail:'Kevin: estructura de madera, frentes plomo y compartimentos abiertos.'},
  {name:'Aparador Escanor',room:'comedor',productId:'escanor',catalogCategory:'aparadores',hotspot:[-.7,1.18,-1.4],detail:'Escanor: volúmenes diagonales en madera sobre una base blanca escalonada.'},
  {
    name: 'Mesa de comedor Irene',
    room: 'comedor',
    productId: 'irene-comedor',
    catalogSearch: 'irene',
    catalogCategory: 'mesas-de-comedor',
    hotspot: [.4, 1, .55],
    detail: 'Tablero rectangular de acabado madera y estructura negra con patas cilíndricas.',
    preview: { image: images.diningIrene, specs: '180 × 75 × 90 cm' },
  },
  {
    name: 'Cama Alferez',
    room: 'dormitorio',
    productId: 'alferez',
    catalogCategory: 'soportes-de-cama',
    hotspot: [-1, .66, .88],
    detail: 'Base de acabado madera con zócalo negro y cabecera de tres paneles.',
    preview: { image: images.bedAlferez, specs: '165 × 90 × 205 cm' },
  },
  {name:'Ropero',room:'dormitorio',productId:'runa',catalogCategory:'roperos',hotspot:[.75,1.25,-1.3],detail:'Runa: seis puertas, laterales claros y centro de madera acanalada.'},
]

export function showroomCatalogHref(piece: Pick<ShowroomPiece, 'catalogCategory' | 'catalogSearch' | 'productId'>) {
  const query = new URLSearchParams({
    categoria: piece.catalogCategory,
    q: piece.catalogSearch ?? piece.productId,
  })
  return `#catalogo?${query}`
}

import type { DemoProduct } from './demo'

export interface CatalogPhoto { src: string; label: string }
export interface CatalogFinish { name: string; photos: CatalogPhoto[] }

// Vite emits URLs; photos are requested only when a card/gallery displays them.
const files = import.meta.glob<string>(['../../assets/images/aparadores/**/*.webp', '!../../assets/images/aparadores/**/._*'], { eager: true, query: '?url', import: 'default' })
const variants: Record<string, { folder: string; name: string; cover: string }[]> = {
  arden: [
    { folder: 'Blanco y duna', name: 'Blanco y duna', cover: 'arden.webp' },
    { folder: 'Plomo y duna', name: 'Plomo y duna', cover: 'arden-plomo.webp' },
  ],
  arian: [
    { folder: 'agave-y-dorado', name: 'Agave y dorado', cover: 'arian-agave.webp' },
    { folder: 'blanco-y-dorado', name: 'Blanco y dorado', cover: 'arian.webp' },
    { folder: 'negro-y-dorado', name: 'Negro y dorado', cover: 'arian-negro.webp' },
    { folder: 'azul-mediterraneo-y-dorado', name: 'Azul mediterráneo y dorado', cover: 'aria-azul.webp' },
  ],
}

function photoLabel(path: string) {
  if (/medid/i.test(path)) return 'Medidas'
  if (/cajones/i.test(path)) return 'Interior y cajones'
  if (/fondo|presentacion|panoramico/i.test(path)) return 'Vista del ambiente'
  if (/enfoque|diseno/i.test(path)) return 'Detalles del acabado'
  return 'Vista del producto'
}

export function catalogFinishes(product: DemoProduct): CatalogFinish[] {
  const folders = variants[product.id] ?? [{ folder: '', name: product.color, cover: '' }]
  return folders.map(variant => {
    const prefix = `../../assets/images/aparadores/${product.id}/${variant.folder ? `${variant.folder}/` : ''}`
    const photos = Object.entries(files).filter(([path]) => path.startsWith(prefix)).map(([path, src]) => ({ src, label: photoLabel(path), path }))
    photos.sort((a, b) => {
      const rank = (photo: typeof a) => photo.path.endsWith(`/${variant.cover}`) || photo.src === product.image ? -1 : /medid/i.test(photo.path) ? 2 : 0
      return rank(a) - rank(b) || a.path.localeCompare(b.path)
    })
    return { name: variant.name, photos: photos.length ? photos : product.image ? [{ src: product.image, label: 'Vista del producto' }] : [] }
  })
}

export const catalogGroups = [
  { name: 'Almacenaje', ids: ['aparadores','archivadores','armarios','comodas-cajoneras','estantes','libreros','muebles-bar','repisas','reposteros'] },
  { name: 'Mesas y sillas', ids: ['mesas-de-centro','mesas-de-tv','mesas-auxiliares','mesas-de-comedor','juegos-de-comedor','mesas-consola','escritorios','sillas','bancos-de-bar','carpetas-pupitres'] },
  { name: 'Dormitorio', ids: ['roperos','soportes-de-cama','cabeceras','veladores','tocadores','zapateras','baules'] },
  { name: 'Complementos', ids: ['counters-recibidores','percheros','muebles-de-bano','casas-mascotas','maceteros'] },
]

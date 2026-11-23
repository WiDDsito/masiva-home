import logo from '../../assets/images/logo/masiva-home-logo.webp'

const root = '../../assets/images/'
const files = import.meta.glob<string>([
  '../../assets/images/**/*.{webp,jpg,jpeg,png,avif}',
  '!../../assets/images/**/._*',
  '!../../assets/images/logo/**',
], { eager: true, query: '?url', import: 'default' })

// Use only files that are present while the local image collection is being updated.
const localImages = new Map(Object.entries(files).map(([path, src]) => [
  path.slice(root.length).normalize('NFC'), src,
] as const))

export const images = {
  logo,
  escanor: localImages.get('aparadores/escanor/ap-escanor.webp') ?? localImages.get('aparadores/ap-escanor-hover.webp'),
  gina: localImages.get('archivadores/acvd-gina.webp') ?? localImages.get('archivadores/acvd-gina-hover.webp'),
  yoshi: localImages.get('escritorios/ect-yoshi.webp'),
  fabela: localImages.get('mesas-de-centro/mdc-fabela.webp'),
  irene: localImages.get('mesas-de-centro/mdc-irene.webp'),
  kevin: localImages.get('mesas-de-tv/mdtv-kevin.webp'),
  runa: localImages.get('roperos/rp-runa.webp'),
  aira: localImages.get('aparadores/aira/aira.webp'),
  arden: localImages.get('aparadores/arden/Blanco y duna/arden.webp'),
  arian: localImages.get('aparadores/arian/agave-y-dorado/arian-agave.webp'),
  ars: localImages.get('aparadores/ars/A.webp'),
  bruyne: localImages.get('aparadores/bruyne/bruyne.webp'),
  capra: localImages.get('aparadores/capra/capra.webp'),
  cedric: localImages.get('aparadores/cedric/cedric.webp'),
} as const

export type ImageKey = keyof typeof images

const categoryFolders = new Map([
  ['comodas-cajoneras', 'comodas'],
  ['counters-recibidores', 'counters'],
  ['mesas-consola', 'mesas-consolas'],
  ['muebles-de-bano', 'mueble-de-baño'],
  ['percheros', 'perchero'],
  ['soportes-de-cama', 'soporte-de-cama'],
  ['casas-mascotas', 'pet-house'],
  ['carpetas-pupitres', 'carpetas'],
])

const categoryPreviews = new Map<string, { src: string; isHover: boolean }>()
for (const [path, src] of localImages) {
  const [folder, file, ...nested] = path.split('/')
  if (!file || nested.length) continue

  const isHover = /-hover\.[^.]+$/i.test(file)
  const current = categoryPreviews.get(folder)
  if (!current || (isHover && !current.isHover)) categoryPreviews.set(folder, { src, isHover })
}

export function categoryPreviewImage(category: string) {
  return categoryPreviews.get(categoryFolders.get(category) ?? category)?.src
}

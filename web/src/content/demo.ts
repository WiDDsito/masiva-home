/** Catálogo local verificado contra Carga General el 2026-11-11.
 * Precio: columna Precio. Cotizaciones no alimenta precios públicos.
 * Selección inicial con fotografía local; stock y checkout pendientes de conexión.
 */
import { images } from './images'

export const IS_DEMO = true

export type Availability = 'in_stock' | 'made_to_order' | 'unconfirmed'

export interface DemoCategory {
  id: string
  name: string
  count: number
  featured?: boolean
  tone: 'ivory' | 'greige' | 'wood' | 'dark'
  image?: string
}

export interface DemoProduct {
  id: string
  name: string
  model: string
  category: string
  color: string
  dimensions: string
  source: string
  price: number
  availability: Availability
  tone: 'ivory' | 'greige' | 'wood' | 'dark'
  image?: string
}

export const categories: DemoCategory[] = [
  { id: 'sala', name: 'Sala', count: 3, featured: true, tone: 'greige', image: images.kevin },
  { id: 'comedor', name: 'Comedor', count: 1, tone: 'ivory', image: images.escanor },
  { id: 'dormitorio', name: 'Dormitorio', count: 1, tone: 'wood', image: images.runa },
  { id: 'escritorio', name: 'Escritorio', count: 1, tone: 'ivory', image: images.yoshi },
  { id: 'almacenaje', name: 'Almacenaje', count: 1, tone: 'dark', image: images.gina },
]

export const products: DemoProduct[] = [
  {
    "id": "escanor",
    "name": "Aparador Escanor",
    "model": "200100001001",
    "price": 959.0,
    "availability": "unconfirmed",
    "category": "comedor",
    "tone": "wood",
    "image": images.escanor,
    "color": "Blanco y duna",
    "dimensions": "130 × 100 × 35 cm",
    "source": "1. Aparadores!G2"
  },
  {
    "id": "fabela",
    "name": "Mesa de centro Fabela",
    "model": "201300010001",
    "price": 659.0,
    "availability": "unconfirmed",
    "category": "sala",
    "tone": "ivory",
    "image": images.fabela,
    "color": "Espresso y Negro",
    "dimensions": "110 × 40 × 60 cm",
    "source": "Mesas de Centro!H11"
  },
  {
    "id": "runa",
    "name": "Ropero Runa",
    "model": "202100027001",
    "price": 4187.0,
    "availability": "unconfirmed",
    "category": "dormitorio",
    "tone": "greige",
    "image": images.runa,
    "color": "Castaño y Blanco",
    "dimensions": "230 × 220 × 50 cm",
    "source": "Roperos!G28"
  },
  {
    "id": "gina",
    "name": "Archivador Gina",
    "model": "200200011001",
    "price": 599.0,
    "availability": "unconfirmed",
    "category": "almacenaje",
    "tone": "dark",
    "image": images.gina,
    "color": "Avellana y Plomo",
    "dimensions": "55 × 130 × 45 cm",
    "source": "2. Archivadores!H12"
  },
  {
    "id": "yoshi",
    "name": "Escritorio Yoshi",
    "model": "200700050001",
    "price": 804.0,
    "availability": "unconfirmed",
    "category": "escritorio",
    "tone": "ivory",
    "image": images.yoshi,
    "color": "Blanco",
    "dimensions": "138 × 137 × 30 cm",
    "source": "7. Escritorios!H51"
  },
  {
    "id": "irene",
    "name": "Mesa de centro Irene",
    "model": "201300018001",
    "price": 887.0,
    "availability": "unconfirmed",
    "category": "sala",
    "tone": "wood",
    "image": images.irene,
    "color": "Duna y negro",
    "dimensions": "100 × 45 × 40 cm",
    "source": "Mesas de Centro!H19"
  },
  {
    "id": "kevin",
    "name": "Mesa de TV Kevin",
    "model": "201500003001",
    "price": 1379.0,
    "availability": "unconfirmed",
    "category": "sala",
    "tone": "wood",
    "image": images.kevin,
    "color": "Panela y Plomo",
    "dimensions": "200 × 50 × 40 cm",
    "source": "Mesas TV!H4"
  },
  {
    "id": "aira",
    "name": "Aparador Aira",
    "model": "Por confirmar",
    "price": 0,
    "availability": "unconfirmed",
    "category": "comedor",
    "tone": "ivory",
    "image": images.aira,
    "color": "Blanco",
    "dimensions": "Medidas por confirmar",
    "source": "1. Aparadores"
  },
  {
    "id": "arden",
    "name": "Aparador Arden",
    "model": "Por confirmar",
    "price": 0,
    "availability": "unconfirmed",
    "category": "comedor",
    "tone": "greige",
    "image": images.arden,
    "color": "Blanco y duna / Plomo y duna",
    "dimensions": "Medidas por confirmar",
    "source": "1. Aparadores"
  },
  {
    "id": "arian",
    "name": "Aparador Arian",
    "model": "Por confirmar",
    "price": 0,
    "availability": "unconfirmed",
    "category": "comedor",
    "tone": "wood",
    "image": images.arian,
    "color": "Varios tonos y dorado",
    "dimensions": "Medidas por confirmar",
    "source": "1. Aparadores"
  },
  {
    "id": "ars",
    "name": "Aparador Ars",
    "model": "Por confirmar",
    "price": 0,
    "availability": "unconfirmed",
    "category": "comedor",
    "tone": "dark",
    "image": images.ars,
    "color": "Acabado a elegir",
    "dimensions": "Medidas por confirmar",
    "source": "1. Aparadores"
  },
  {
    "id": "bruyne",
    "name": "Aparador Bruyne",
    "model": "Por confirmar",
    "price": 0,
    "availability": "unconfirmed",
    "category": "comedor",
    "tone": "wood",
    "image": images.bruyne,
    "color": "Acabado a elegir",
    "dimensions": "Medidas por confirmar",
    "source": "1. Aparadores"
  }
]

export const navItems = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#tienda', label: 'Tienda' },
  { href: '#showroom', label: 'Showroom' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#contacto', label: 'Contacto' },
]

export const claims = [
  { title: 'Fabricación propia', text: 'Diseñamos y producimos en Lima.' },
  { title: 'Diseño funcional', text: 'Pensado para el uso diario.' },
  { title: 'Atención personalizada', text: 'Te acompañamos antes de comprar.' },
]

export const services = [
  {
    title: 'Compra en línea',
    text: 'Explora los modelos y guarda tu selección en el carrito. Confirma con nuestro equipo los acabados, la disponibilidad y la entrega.',
    accent: false,
  },
  {
    title: 'Cotización por WhatsApp',
    text: 'Si necesitas varias piezas o tienes dudas, enviamos tu selección y te respondemos con el detalle.',
    accent: true,
  },
  {
    title: 'Entrega, recojo y garantía',
    text: 'Recoge en tienda sin costo o coordina el envío. La garantía y los plazos se informan antes de pagar.',
    accent: false,
  },
  {
    title: 'Instalación y montaje',
    text: 'Montamos y dejamos listo el mueble en tu espacio, con las medidas verificadas antes de entregar.',
    accent: false,
  },
]

export const contact = {
  phone: '+51 965 006 155',
  phoneHref: 'tel:+51965006155',
  email: 'contacto@masivahome.com',
  city: 'Lima, Perú',
  whatsapp:
    'https://wa.me/51965006155?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20Masiva%20Home.',
}

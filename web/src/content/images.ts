/**
 * Imágenes reales del proyecto.
 *
 * Convención de nombres (alineada con Drive): prefijo de categoría + modelo.
 *   ap    → aparadores
 *   acvd  → archivadores
 *   ect   → escritorios
 *   mdc   → mesas de centro
 *   mdtv  → mesas de TV
 *   rp    → roperos
 *
 * Si una imagen falta, los componentes caen al marco de «fotografía pendiente».
 */
import escanor from '../../assets/images/aparadores/escanor/ap-escanor.webp'
import gina from '../../assets/images/archivadores/acvd-gina.webp'
import yoshi from '../../assets/images/escritorios/ect-yoshi.webp'
import fabela from '../../assets/images/mesas-de-centro/mdc-fabela.webp'
import irene from '../../assets/images/mesas-de-centro/mdc-irene.webp'
import kevin from '../../assets/images/mesas-de-tv/mdtv-kevin.webp'
import runa from '../../assets/images/roperos/rp-runa.webp'
import logo from '../../assets/images/logo/masiva-home-logo.webp'

/* Aparadores adicionales (imágenes de Drive, «por mientras»). */
import aira from '../../assets/images/aparadores/aira/aira.webp'
import arden from '../../assets/images/aparadores/arden/Blanco y duna/arden.webp'
import arian from '../../assets/images/aparadores/arian/agave-y-dorado/arian-agave.webp'
import ars from '../../assets/images/aparadores/ars/A.webp'
import bruyne from '../../assets/images/aparadores/bruyne/bruyne.webp'
import capra from '../../assets/images/aparadores/capra/capra.webp'
import cedric from '../../assets/images/aparadores/cedric/cedric.webp'

export const images = {
  escanor,
  gina,
  yoshi,
  fabela,
  irene,
  kevin,
  runa,
  logo,
  aira,
  arden,
  arian,
  ars,
  bruyne,
  capra,
  cedric,
} as const

export type ImageKey = keyof typeof images

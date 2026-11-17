import { categories } from './demo'

/** Product families present in the supplied inventory/Drive; existing room filters remain available. */
export const productFamilies = [
  {id:'aparadores',name:'Aparadores'},
  {id:'archivadores',name:'Archivadores'},
  {id:'armarios',name:'Armarios'},
  {id:'bancos-de-bar',name:'Bancos de bar'},
  {id:'comodas-cajoneras',name:'Cómodas y cajoneras'},
  {id:'counters-recibidores',name:'Counters y recibidores'},
  {id:'escritorios',name:'Escritorios'},
  {id:'estantes',name:'Estantes'},
  {id:'juegos-de-comedor',name:'Juegos de comedor'},
  {id:'libreros',name:'Libreros'},
  {id:'mesas-consola',name:'Mesas consola'},
  {id:'mesas-auxiliares',name:'Mesas auxiliares'},
  {id:'mesas-de-centro',name:'Mesas de centro'},
  {id:'mesas-de-comedor',name:'Mesas de comedor'},
  {id:'mesas-de-tv',name:'Mesas de TV'},
  {id:'muebles-de-bano',name:'Muebles de baño'},
  {id:'muebles-bar',name:'Muebles bar'},
  {id:'percheros',name:'Percheros'},
  {id:'repisas',name:'Repisas'},
  {id:'reposteros',name:'Reposteros'},
  {id:'roperos',name:'Roperos'},
  {id:'sillas',name:'Sillas'},
  {id:'soportes-de-cama',name:'Soportes de cama'},
  {id:'tocadores',name:'Tocadores'},
  {id:'veladores',name:'Veladores'},
  {id:'zapateras',name:'Zapateras'},
  {id:'baules',name:'Baúles'},
  {id:'cabeceras',name:'Cabeceras'},
  {id:'casas-mascotas',name:'Casas para mascotas'},
  {id:'maceteros',name:'Maceteros'},
  {id:'carpetas-pupitres',name:'Carpetas / Pupitres'},
]

export const catalogFilterCategories = [...categories.map(({id,name})=>({id,name})), ...productFamilies]

/** Product families for the models currently loaded in the local catalogue. */
export const productFamilyById: Record<string,string> = {
  escanor:'aparadores', gina:'archivadores', yoshi:'escritorios',
  fabela:'mesas-de-centro', irene:'mesas-de-centro', kevin:'mesas-de-tv', runa:'roperos',
  aira:'aparadores', arden:'aparadores', arian:'aparadores', ars:'aparadores', bruyne:'aparadores',
  capra:'aparadores', cedric:'aparadores',
}

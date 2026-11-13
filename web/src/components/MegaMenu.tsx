import { useState } from 'react'
import { products } from '../content/demo'
import { productFamilies, productFamilyById } from '../content/catalogFilters'

const groups = [
  { name: 'Sala y comedor', ids: ['aparadores', 'mesas-de-centro', 'mesas-de-tv'] },
  { name: 'Dormitorio', ids: ['roperos'] },
  { name: 'Oficina y orden', ids: ['escritorios', 'archivadores'] },
]
const countFor = (id: string) => products.filter(product => productFamilyById[product.id] === id).length

/** Categories and preview use the same selection for mouse, keyboard and touch. */
export function MegaMenu({ onSelect, mobile = false }: { onSelect: (id: string) => void; mobile?: boolean }) {
  const [hovered, setHovered] = useState('aparadores')
  const featured = productFamilies.find(category => category.id === hovered)!
  const photo = products.find(product => productFamilyById[product.id] === hovered)
  return <div className={`mega${mobile ? ' mega--mobile' : ''}`} id={mobile ? 'mega-tienda-movil' : 'mega-tienda'} data-lenis-prevent>
    <div className="mega__inner">
      <div className="mega__browse">
        <button className="mega__all" type="button" onClick={() => onSelect('all')}>Ver todo el catálogo <span aria-hidden="true">↗</span></button>
        <div className="mega__categories">
          {groups.map(group => <div className="mega__group" key={group.name}><h2>{group.name}</h2>{group.ids.map(id => <button key={id} className="mega__link" type="button" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(id) }} onFocus={() => setHovered(id)} onClick={() => onSelect(id)}><span>{productFamilies.find(category => category.id === id)?.name}</span><span className="mega__count">{countFor(id)}</span></button>)}</div>)}
        </div>
      </div>
      <button type="button" className="mega__feature" aria-label={`Ver ${featured.name.toLowerCase()}`} onClick={() => onSelect(featured.id)}>
        <img className="mega__feature-img" src={photo?.image} alt={featured.name} loading="lazy" width="400" height="300" />
        <span className="mega__feature-label"><strong>{featured.name}</strong><span>{countFor(featured.id)} {countFor(featured.id) === 1 ? 'modelo' : 'modelos'} · Explorar categoría</span></span>
      </button>
    </div>
  </div>
}

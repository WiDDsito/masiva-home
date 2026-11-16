import { Button } from '../components/Button'
import { contact } from '../content/demo'
import '../styles/help.css'

const topics = {
  preguntas: {
    title: 'Preguntas frecuentes',
    sections: [
      ['¿Dónde encuentro un mueble?', 'En el catálogo puedes buscar por nombre o SKU y filtrar por categoría. Pulsa la imagen del producto para abrir su vista rápida.'],
      ['¿Dónde veo sus medidas y acabados?', 'La vista rápida muestra las fotografías, los acabados y las medidas disponibles. Si algún dato está por confirmar, consúltanos antes de elegir.'],
      ['¿Cómo confirmo disponibilidad?', 'Agrega los productos con precio a tu bolsa y usa «Consultar mi selección por WhatsApp». El equipo podrá confirmar disponibilidad y entrega. Los productos sin precio tienen una opción de consulta en su ficha.'],
    ],
    action: 'Resolver una duda por WhatsApp',
    message: 'Hola, tengo una consulta sobre los muebles de Masiva Home.',
  },
  entrega: {
    title: 'Entrega y recojo',
    sections: [
      ['Coordina la entrega de tu selección', 'La disponibilidad, el costo y la fecha de entrega están por confirmar. Comparte los productos que te interesan y tu distrito para consultar las opciones.'],
      ['¿Prefieres recoger tu mueble?', 'Consulta si el producto permite recojo y confirma el lugar y el horario con el equipo antes de acercarte.'],
    ],
    action: 'Consultar entrega por WhatsApp',
    message: 'Hola, quisiera consultar las opciones de entrega o recojo de mi selección.',
  },
  garantia: {
    title: 'Garantía',
    sections: [
      ['Consulta las condiciones de tu producto', 'Antes de confirmar tu compra, solicita al equipo las condiciones de garantía aplicables al mueble que elegiste, su cobertura y cómo recibir atención.'],
      ['¿Necesitas ayuda con un mueble?', 'Comparte el nombre del producto y explica qué necesitas revisar. El equipo te orientará sobre los siguientes pasos.'],
    ],
    action: 'Consultar garantía por WhatsApp',
    message: 'Hola, quisiera consultar las condiciones de garantía de un mueble.',
  },
}

export function Help({ topic }: { topic: string }) {
  const selected = Object.hasOwn(topics, topic) ? topic as keyof typeof topics : 'preguntas'
  const content = topics[selected]
  const whatsapp = `${contact.whatsapp.split('?')[0]}?text=${encodeURIComponent(content.message)}`
  return <section className="help-page container" aria-labelledby="help-title">
    <nav className="help-page__nav" aria-label="Ayuda para tu compra">
      {Object.entries(topics).map(([id, item]) => <a key={id} href={`#ayuda?tema=${id}`} aria-current={selected === id ? 'page' : undefined}>{item.title}</a>)}
    </nav>
    <h1 id="help-title">{content.title}</h1>
    <div className="help-page__content">
      {content.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
    </div>
    <div className="help-page__actions"><Button href={whatsapp} external>{content.action}</Button><a className="link" href="#catalogo">Explorar el catálogo</a></div>
  </section>
}

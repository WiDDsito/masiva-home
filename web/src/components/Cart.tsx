import { Button } from './Button'
import { useEffect, useRef } from 'react'
import { products, contact } from '../content/demo'
import { useCart } from '../lib/CartContext'
import { formatPEN } from '../lib/format'

export function Cart() {
  const { lines, setQuantity, open, setOpen, notice, count } = useCart()
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
    const overflow = document.documentElement.style.overflow
    if (open) document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = overflow }
  }, [open])
  const items = lines.flatMap(line => { const product = products.find(p => p.id === line.id); return product ? [{ ...line, product }] : [] })
  const total = items.reduce((n, l) => n + Math.round(l.product.price * 100) * l.quantity, 0) / 100
  const message = `Hola, quisiera confirmar disponibilidad y entrega de:\n${items.map(l => `${l.quantity} × ${l.product.name} (${l.product.model}, ${l.product.color}) — ${formatPEN(l.product.price * l.quantity)}`).join('\n')}\nSubtotal de productos: ${formatPEN(total)}. Envío por confirmar.`
  const whatsapp = `${contact.whatsapp.split('?')[0]}?text=${encodeURIComponent(message)}`
  return <>
    <div className={`cart-notice ${notice && !open ? 'is-visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      {notice && <><span className="cart-notice__icon" aria-hidden="true">✓</span><div><strong>Agregado a tu bolsa</strong><p>{notice}</p><Button onClick={() => setOpen(true)}>Ver bolsa ({count})</Button></div></>}
    </div>
    <dialog ref={dialog} id="shopping-bag" className="cart-dialog" aria-labelledby="cart-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} data-lenis-prevent>
      <div className="cart-dialog__head"><h2 id="cart-title">Tu carrito</h2><button className="icon-btn" type="button" autoFocus aria-label="Cerrar carrito" onClick={() => setOpen(false)}>×</button></div>
      {items.length ? <>
        <ul className="cart-lines">{items.map(({ id, quantity, product }) => <li key={id}>
          <img src={product.image} alt="" width="80" height="90" />
          <div><h3>{product.name}</h3><p>{product.color}</p><p>{formatPEN(product.price)}</p>
            <div className="cart-quantity"><button type="button" aria-label={`Reducir cantidad de ${product.name}`} onClick={() => setQuantity(id, quantity - 1)}>−</button><span aria-label={`Cantidad: ${quantity}`}>{quantity}</span><button type="button" disabled={quantity >= 99} aria-label={`Aumentar cantidad de ${product.name}`} onClick={() => setQuantity(id, quantity + 1)}>+</button><button className="link" type="button" onClick={() => setQuantity(id, 0)}>Eliminar {product.name}</button></div>
          </div>
        </li>)}</ul>
        <div className="cart-summary"><p>Subtotal <strong>{formatPEN(total)}</strong></p><p>Entrega y disponibilidad por confirmar.</p><Button block href={whatsapp} external>Consultar mi selección por WhatsApp</Button><p>Vista local. El pago en línea se habilitará al conectar el checkout de la tienda.</p></div>
      </> : <div className="cart-empty"><h3>Tu próximo mueble te espera.</h3><p>Explora el catálogo y guarda aquí tus favoritos para comprar.</p><Button onClick={() => setOpen(false)}>Seguir explorando</Button></div>}
    </dialog>
  </>
}

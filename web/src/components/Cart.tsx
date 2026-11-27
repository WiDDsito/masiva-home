import { WooLineControls } from './WooLineControls'
import { Button } from './Button'
import { CartNotice } from './CartNotice'
import { useEffect, useRef } from 'react'
import { contact } from '../content/demo'
import { useCart } from '../lib/CartContext'
import { localCartSummary } from '../lib/localCartSummary'
import { formatPEN } from '../lib/format'
import { formatWooCartMoney } from '../lib/wooCart'

export function Cart() {
  const { lines, wooCart, wooCheckoutUrl, wooNativeCartUrl, wooCartFallbackUrl, wooNotice, wooPending, wooCartStatus, refreshWooCart, setQuantity, open, setOpen } = useCart()
  const dialog = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) { closing.current = false; delete element.dataset.closing; element.showModal() }
    if (!open) {
      if (element.open) element.close()
      element.getAnimations().forEach(animation => animation.cancel())
      delete element.dataset.closing
      closing.current = false
    }
    const overflow = document.documentElement.style.overflow
    if (open) document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = overflow }
  }, [open])
  const requestClose = async () => {
    const element = dialog.current
    if (!element?.open || closing.current) return
    closing.current = true
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const style = getComputedStyle(element)
    const from = { opacity: style.opacity, transform: style.transform }
    // Production CSS may shorten 320ms to .32s; Web Animations expects milliseconds.
    const cssDuration = style.getPropertyValue('--cart-close-duration').trim()
    const duration = parseFloat(cssDuration) * (cssDuration.endsWith('ms') ? 1 : 1000)
    element.getAnimations().forEach(animation => animation.cancel())
    element.dataset.closing = 'true'
    if (typeof element.animate === 'function') {
      await element.animate([from, { opacity: reduced ? 0 : from.opacity, transform: reduced ? 'none' : 'translateX(100%)' }], {
        duration: Number.isFinite(duration) ? duration : (reduced ? 160 : 320), easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards',
      }).finished.catch(() => undefined)
    }
    if (element.dataset.closing === 'true') setOpen(false)
  }
  const { items, subtotal: total } = localCartSummary(lines)
  const wooItems = wooCart?.items ?? []
  const message = `Hola, quisiera confirmar disponibilidad y entrega de:\n${items.map(l => `${l.quantity} × ${l.product.name} (${l.product.model}, ${l.product.color}) — ${formatPEN(l.product.price * l.quantity)}`).join('\n')}\nSubtotal de productos: ${formatPEN(total)}. Envío por confirmar.`
  const whatsapp = `${contact.whatsapp.split('?')[0]}?text=${encodeURIComponent(message)}`
  return <>
    <CartNotice />
    <dialog ref={dialog} id="shopping-bag" className="cart-dialog" aria-labelledby="cart-title" onCancel={event => { event.preventDefault(); void requestClose() }} onClose={() => setOpen(false)} data-lenis-prevent>
      <div className="cart-dialog__head"><h2 id="cart-title">Tu carrito</h2><button className="icon-btn" type="button" autoFocus aria-label="Cerrar carrito" onClick={() => void requestClose()}>×</button></div>
      {!wooNativeCartUrl && wooCartFallbackUrl && wooItems.length > 0 && !wooPending && wooCartStatus === 'ready' && <a className="link" href={wooCartFallbackUrl}>Ir al pago en Masiva Home</a>}
      {wooNotice && <p role="alert">{wooNotice}</p>}
      {wooNativeCartUrl && <a className="link" href={wooNativeCartUrl}>Abrir carrito de WooCommerce</a>}
      {wooCartStatus === 'error' && <div className="cart-summary">
        <p role="alert">No pudimos consultar tu carrito de WooCommerce.</p>
        <Button variant="ghost" onClick={refreshWooCart}>Volver a intentar</Button>
      </div>}
      {items.length || wooItems.length ? <>
        <ul className="cart-lines">{items.map(({ id, quantity, product }) => <li key={id}>
          {product.image ? <img src={product.image} alt="" width="80" height="90" /> : <span aria-hidden="true" />}
          <div><h3>{product.name}</h3><p>{product.color}</p><p>{formatPEN(product.price)}</p>
            <div className="cart-quantity"><button type="button" aria-label={`Reducir cantidad de ${product.name}`} onClick={() => setQuantity(id, quantity - 1)}>−</button><span aria-label={`Cantidad: ${quantity}`}>{quantity}</span><button type="button" disabled={quantity >= 99} aria-label={`Aumentar cantidad de ${product.name}`} onClick={() => setQuantity(id, quantity + 1)}>+</button><button className="link" type="button" onClick={() => setQuantity(id, 0)}>Eliminar {product.name}</button></div>
          </div>
        </li>)}
        {wooItems.map(item => <li key={item.key}>
          {item.images[0] ? <img src={item.images[0].src} alt="" width="80" height="90" /> : <span aria-hidden="true" />}
          <div>
            <h3>{item.name}</h3>
            {item.variation.map(pair => <p key={pair.attribute}>{pair.attribute}: {pair.value}</p>)}
            <p>Cantidad: {item.quantity} × {formatWooCartMoney(item.prices.price, item.prices)}</p>
            {wooCheckoutUrl && <WooLineControls item={item} />}
            <p>{formatWooCartMoney(item.totals.line_total, item.totals)}</p>
          </div>
        </li>)}</ul>
        {(!wooCheckoutUrl || wooItems.length > 0) && <div className="cart-checkout-action">
          <Button block disabled={wooPending} onClick={() => {
            setOpen(false)
            window.location.hash = '#finalizar-compra'
          }}>Finalizar compra</Button>
        </div>}
        {items.length > 0 && <div className="cart-summary"><p>{wooItems.length ? 'Subtotal de la selección local' : 'Subtotal'} <strong>{formatPEN(total)}</strong></p><p>Entrega y disponibilidad por confirmar.</p><Button block href={whatsapp} external>Consultar mi selección por WhatsApp</Button><p>Esta selección se gestiona por WhatsApp.</p></div>}
        {wooCart && wooItems.length > 0 && <div className="cart-summary">
          <p>{wooCheckoutUrl ? 'Subtotal de WooCommerce' : 'Subtotal simulado'} <strong>{formatWooCartMoney(wooCart.totals.total_items, wooCart.totals)}</strong></p>
          {!wooCheckoutUrl && <p>Total simulado <strong>{formatWooCartMoney(wooCart.totals.total_price, wooCart.totals)}</strong></p>}
        </div>}
      </> : wooCartStatus === 'loading' ? <p className="cart-summary" role="status">Cargando carrito…</p>
        : wooCartStatus === 'error' ? null : <div className="cart-empty"><h3>Tu próximo mueble te espera.</h3><p>Explora el catálogo y guarda aquí tus favoritos para comprar.</p><Button onClick={() => void requestClose()}>Seguir explorando</Button></div>}
    </dialog>
  </>
}

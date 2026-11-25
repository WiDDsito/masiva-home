import { Button } from '../components/Button'
import { products } from '../content/demo'
import { useCart } from '../lib/CartContext'
import { formatPEN } from '../lib/format'
import { formatWooCartMoney } from '../lib/wooCart'
import '../styles/checkout.css'

function CheckoutItem({ name, image, detail, quantity, amount }: {
  name: string
  image?: string
  detail: string
  quantity: number
  amount: string
}) {
  return (
    <li className="checkout-item">
      {image ? <img src={image} alt="" width="64" height="64" /> : <span aria-hidden="true" />}
      <div>
        <strong>{name}</strong>
        {detail && <p>{detail}</p>}
        <p>{quantity} {quantity === 1 ? 'unidad' : 'unidades'}</p>
      </div>
      <strong>{amount}</strong>
    </li>
  )
}

export function Checkout() {
  const { lines, wooCart, wooCheckoutUrl, wooCartStatus, refreshWooCart, setOpen } = useCart()
  const localItems = lines.flatMap(line => {
    const product = products.find(item => item.id === line.id)
    return product ? [{ ...line, product }] : []
  })
  const wooItems = wooCart?.items ?? []
  const localSubtotal = localItems.reduce((cents, { product, quantity }) =>
    cents + Math.round(product.price * 100) * quantity, 0) / 100
  const hasItems = localItems.length > 0 || wooItems.length > 0
  const canContinue = wooCheckoutUrl && wooItems.length > 0 && wooCartStatus === 'ready'

  return (
    <section className="container checkout" aria-labelledby="checkout-title">
      <button className="checkout-back" type="button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">←</span> Volver al carrito
      </button>
      <h1 id="checkout-title">Finalizar compra</h1>
      <p className="checkout-intro">Revisa tu selección y las opciones de entrega y pago.</p>
      <div className="checkout-layout">
        <div>
          <fieldset className="checkout-section" disabled>
            <legend>Datos de contacto</legend>
            <div className="checkout-fields">
              <label>Nombre<input autoComplete="given-name" placeholder="Tu nombre" /></label>
              <label>Apellidos<input autoComplete="family-name" placeholder="Tus apellidos" /></label>
              <label>Correo electrónico<input type="email" autoComplete="email" placeholder="nombre@correo.com" /></label>
              <label>Celular<input type="tel" autoComplete="tel" placeholder="+51 900 000 000" /></label>
            </div>
          </fieldset>
          <fieldset className="checkout-section" disabled>
            <legend>Entrega</legend>
            <label className="checkout-option">
              <input type="radio" name="delivery" />
              <span><strong>Envío a domicilio</strong><small>Costo por confirmar.</small></span>
            </label>
            <label className="checkout-option">
              <input type="radio" name="delivery" />
              <span><strong>Recojo en showroom</strong><small>Disponibilidad por confirmar.</small></span>
            </label>
          </fieldset>
          <section className="checkout-section" aria-labelledby="checkout-payment">
            <h2 id="checkout-payment">Método de pago</h2>
            <p className="checkout-option">{wooCheckoutUrl
              ? 'Completa tus datos de entrega y pago en la página de WooCommerce.'
              : 'Pago en línea pendiente de habilitar.'}</p>
          </section>
        </div>

        <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">Resumen del pedido</h2>
          {wooCartStatus === 'loading' && <p className="checkout-preview" role="status">Consultando carrito de WooCommerce…</p>}
          {wooCartStatus === 'error' && <div className="checkout-empty">
            <p role="alert">No pudimos consultar tu carrito de WooCommerce.</p>
            <Button variant="ghost" onClick={refreshWooCart}>Volver a intentar</Button>
          </div>}
          {hasItems ? (
            <>
              <ul className="checkout-items">
                {localItems.map(({ product, quantity }) => (
                  <CheckoutItem key={product.id} name={product.name} image={product.image}
                    detail={product.color} quantity={quantity} amount={formatPEN(product.price * quantity)} />
                ))}
                {wooItems.map(item => (
                  <CheckoutItem key={item.key} name={item.name} image={item.images[0]?.src}
                    detail={item.variation.map(pair => pair.value).join(', ')}
                    quantity={item.quantity} amount={formatWooCartMoney(item.totals.line_total, item.totals)} />
                ))}
              </ul>
              <dl className="checkout-totals">
                {localItems.length > 0 && <div>
                  <dt>{wooCheckoutUrl || wooItems.length > 0 ? 'Subtotal de la selección local' : 'Subtotal'}</dt>
                  <dd>{formatPEN(localSubtotal)}</dd>
                </div>}
                {wooCart && wooItems.length > 0 && <div>
                  <dt>{wooCheckoutUrl ? 'Subtotal de WooCommerce' : 'Subtotal simulado'}</dt>
                  <dd>{formatWooCartMoney(wooCart.totals.total_items, wooCart.totals)}</dd>
                </div>}
                <div><dt>Entrega</dt><dd>Por confirmar</dd></div>
                <div className="checkout-total"><dt>Total</dt><dd>Por confirmar</dd></div>
              </dl>
              {canContinue && <Button block href={wooCheckoutUrl}>Continuar al pago</Button>}
              {wooCheckoutUrl ? (
                localItems.length > 0 && <p className="checkout-preview">La selección local se consulta por WhatsApp desde el carrito.</p>
              ) : (
                <>
                  <Button block disabled>Realizar pedido</Button>
                  <p className="checkout-preview">Vista previa del proceso de compra.</p>
                </>
              )}
            </>
          ) : wooCartStatus === 'ready' && (
            <div className="checkout-empty">
              <p>Tu carrito está vacío.</p>
              <Button block href="#catalogo">Explorar el catálogo</Button>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

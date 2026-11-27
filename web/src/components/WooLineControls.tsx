import { useState } from 'react'
import { useCart } from '../lib/CartContext'
import type { WooCartItem } from '../lib/wooCart'

export function WooLineControls({ item }: { item: WooCartItem }) {
  const { changeWooItem, wooPending, wooCartStatus } = useCart()
  const [error, setError] = useState('')
  const limits = item.quantity_limits
  const step = limits?.multiple_of ?? 1
  const locked = wooPending || wooCartStatus !== 'ready'
  const edit = async (quantity: number) => {
    setError('')
    try { await changeWooItem(item.key, quantity) }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'No pudimos actualizar la cantidad.') }
  }
  return <div className="cart-quantity">
    <button type="button" aria-label={`Reducir cantidad de ${item.name}`}
      disabled={locked || limits?.editable === false || item.quantity - step < (limits?.minimum ?? 1)}
      onClick={() => void edit(item.quantity - step)}>−</button>
    <span aria-live="polite">{item.quantity}</span>
    <button type="button" aria-label={`Aumentar cantidad de ${item.name}`}
      disabled={locked || limits?.editable === false || item.quantity + step > (limits?.maximum ?? Infinity)}
      onClick={() => void edit(item.quantity + step)}>+</button>
    <button className="link" type="button" disabled={locked} onClick={() => void edit(0)}>Eliminar {item.name}</button>
    {error && <span role="alert">{error}</span>}
  </div>
}

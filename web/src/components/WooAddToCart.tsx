import { useState } from 'react'
import { useCart } from '../lib/CartContext'
import { validWooQuantity } from '../lib/wooCart'
import type { PurchaseRules, WooAddItem } from '../lib/wooCart'
import { Button } from './Button'

export function WooAddToCart({ item, purchase }: { item?: Omit<WooAddItem, 'quantity'>; purchase: PurchaseRules }) {
  const { addWooItem, wooPending } = useCart()
  const [quantity, setQuantity] = useState(String(purchase.minimum))
  const [error, setError] = useState('')
  const amount = Number(quantity)
  const canSubmit = !!item && purchase.available && validWooQuantity(amount, purchase) && !wooPending

  async function submit() {
    if (!item || !canSubmit) return
    setError('')
    try {
      await addWooItem({ ...item, quantity: amount })
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'No pudimos añadir el producto al carrito.')
    }
  }

  return (
    <form className="woo-product-details__add" onSubmit={event => {
      event.preventDefault()
      void submit()
    }}>
      <label>
        <span>Cantidad</span>
        <input
          type="number"
          min={purchase.minimum}
          max={purchase.maximum}
          step={purchase.step}
          value={quantity}
          disabled={!item || !purchase.available || wooPending}
          onChange={event => { setQuantity(event.target.value); setError('') }}
        />
      </label>
      <Button type="submit" disabled={!canSubmit}>{wooPending ? 'Añadiendo…' : 'Añadir al carrito'}</Button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}

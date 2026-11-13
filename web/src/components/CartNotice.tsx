import { useEffect, useState } from 'react'
import { useCart } from '../lib/CartContext'
import { Button } from './Button'

/** Feedback stays operable while the pointer, keyboard focus or bag is active. */
export function CartNotice() {
  const { notice, count, open, setOpen, dismissNotice } = useCart()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!notice || open || hovered || focused) return
    const timer = setTimeout(() => dismissNotice(notice.id), 6000)
    return () => clearTimeout(timer)
  }, [notice, open, hovered, focused, dismissNotice])
  return <div className={`cart-notice ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite" aria-atomic="true"
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false) }}>
    {notice && <><span className="cart-notice__icon" aria-hidden="true">{notice.kind === 'limit' ? '!' : '✓'}</span><div>
      <strong>{notice.kind === 'limit' ? 'Límite de cantidad' : 'Agregado a tu bolsa'}</strong><p>{notice.message}</p>
      <Button onClick={() => setOpen(true)}>Ver bolsa ({count})</Button>
    </div></>}
  </div>
}

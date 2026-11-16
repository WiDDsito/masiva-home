import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../content/demo'
import { cartReducer, restoreCart } from './cart'
import type { CartAction, CartFeedback, CartLine, CartState } from './cart'

interface CartActions {
  setQuantity: (id: string, quantity: number) => void
  add: (id: string) => void
  setOpen: (open: boolean) => void
  dismissNotice: (id: number) => void
}
interface CartContextValue extends CartActions {
  lines: CartLine[]
  open: boolean
  count: number
  notice: CartFeedback | null
}
const CartContext = createContext<CartContextValue | null>(null)
const CartActionsContext = createContext<CartActions | null>(null)
const storageKey = 'mh-cart-v1'
const validIds = products.map(product => product.id)
function storedLines(fallback: CartLine[]): CartLine[] {
  try { return restoreCart(localStorage.getItem(storageKey), validIds) } catch { return fallback }
}
function initialCart(): CartState {
  return { lines: storedLines([]), feedback: null, revision: 0 }
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialCart)
  const current = useRef(state)
  const persistent = useRef(true)
  const [open, setOpen] = useState(false)
  const publish = useCallback((next: CartState) => { current.current = next; setState(next) }, [])
  useEffect(() => {
    const refresh = () => {
      if (!persistent.current) return
      const lines = storedLines(current.current.lines)
      if (JSON.stringify(lines) !== JSON.stringify(current.current.lines)) publish({ ...current.current, lines })
    }
    // Read current storage, not event.newValue: queued events may describe older writes.
    const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) refresh() }
    window.addEventListener('storage', sync)
    window.addEventListener('pageshow', refresh)
    window.addEventListener('focus', refresh)
    refresh()
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('pageshow', refresh); window.removeEventListener('focus', refresh) }
  }, [publish])
  const mutate = useCallback((action: Exclude<CartAction, { type: 'dismiss' }>) => {
    const apply = () => {
      const lines = persistent.current ? storedLines(current.current.lines) : current.current.lines
      const next = cartReducer({ ...current.current, lines }, action)
      try { if (persistent.current) localStorage.setItem(storageKey, JSON.stringify(next.lines)) } catch { persistent.current = false }
      publish(next)
    }
    // Serialize read-modify-write across tabs, including simultaneous add clicks.
    if (navigator.locks) void navigator.locks.request(storageKey, apply).catch(apply)
    else apply()
  }, [publish])
  const setQuantity = useCallback((id: string, quantity: number) => {
    if (validIds.includes(id)) mutate({ type: 'quantity', id, quantity })
  }, [mutate])
  const add = useCallback((id: string) => {
    const product = products.find(item => item.id === id)
    if (product) mutate({ type: 'add', product })
  }, [mutate])
  const dismissNotice = useCallback((id: number) => publish(cartReducer(current.current, { type: 'dismiss', id })), [publish])
  const actions = useMemo(() => ({ add, setQuantity, setOpen, dismissNotice }), [add, setQuantity, setOpen, dismissNotice])
  const count = state.lines.reduce((total, line) => total + line.quantity, 0)
  const value = useMemo(() => ({ ...actions, lines: state.lines, notice: state.feedback, open, count }), [actions, state.lines, state.feedback, open, count])
  return <CartActionsContext.Provider value={actions}><CartContext.Provider value={value}>{children}</CartContext.Provider></CartActionsContext.Provider>
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('Falta CartProvider'); return value }
export function useCartActions() { const value = useContext(CartActionsContext); if (!value) throw new Error('Falta CartProvider'); return value }

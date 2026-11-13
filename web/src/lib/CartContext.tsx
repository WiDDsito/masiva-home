import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../content/demo'
import { cartReducer, restoreCart } from './cart'
import type { CartFeedback, CartLine, CartState } from './cart'

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
function initialCart(): CartState {
  let lines: CartLine[] = []
  try { lines = restoreCart(localStorage.getItem('mh-cart-v1'), products.map(product => product.id)) } catch { /* Memory remains available. */ }
  return { lines, feedback: null, revision: 0 }
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initialCart)
  const [open, setOpen] = useState(false)
  useEffect(() => { try { localStorage.setItem('mh-cart-v1', JSON.stringify(state.lines)) } catch { /* The cart continues in memory. */ } }, [state.lines])
  const setQuantity = useCallback((id: string, quantity: number) => {
    if (products.some(product => product.id === id)) dispatch({ type: 'quantity', id, quantity })
  }, [])
  const add = useCallback((id: string) => {
    const product = products.find(item => item.id === id)
    if (product) dispatch({ type: 'add', product })
  }, [])
  const dismissNotice = useCallback((id: number) => dispatch({ type: 'dismiss', id }), [])
  const actions = useMemo(() => ({ add, setQuantity, setOpen, dismissNotice }), [add, setQuantity, setOpen, dismissNotice])
  const count = state.lines.reduce((total, line) => total + line.quantity, 0)
  const value = useMemo(() => ({ ...actions, lines: state.lines, notice: state.feedback, open, count }), [actions, state.lines, state.feedback, open, count])
  return <CartActionsContext.Provider value={actions}><CartContext.Provider value={value}>{children}</CartContext.Provider></CartActionsContext.Provider>
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('Falta CartProvider'); return value }
export function useCartActions() { const value = useContext(CartActionsContext); if (!value) throw new Error('Falta CartProvider'); return value }

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../content/demo'
import { restoreCart, updateCart } from './cart'
import type { CartLine } from './cart'

interface CartContextValue {
  lines: CartLine[]
  setQuantity: (id: string, quantity: number) => void
  add: (id: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  count: number
  notice: string
}
const CartContext = createContext<CartContextValue | null>(null)
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return restoreCart(localStorage.getItem('mh-cart-v1'), products.map(p => p.id)) } catch { return [] }
  })
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => { try { localStorage.setItem('mh-cart-v1', JSON.stringify(lines)) } catch { /* El carrito continúa en memoria. */ } }, [lines])
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer) }, [notice])
  const setQuantity = (id: string, quantity: number) => { if (products.some(p => p.id === id)) setLines(current => updateCart(current, id, quantity)) }
  const add = (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    setLines(current => updateCart(current, id, (current.find(l => l.id === id)?.quantity ?? 0) + 1))
    setNotice(`${product.name} agregado al carrito`)
  }
  return <CartContext.Provider value={{ lines, setQuantity, add, open, setOpen, count: lines.reduce((n, l) => n + l.quantity, 0), notice }}>{children}</CartContext.Provider>
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('Falta CartProvider'); return value }

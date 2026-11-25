import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../content/demo'
import { cartReducer, restoreCart } from './cart'
import type { CartAction, CartFeedback, CartLine, CartState } from './cart'
import { readWooCartResponse, wooAddItemEndpoint, wooCartEndpoint } from './wooCart'
import { wordpressCommerce } from './wordpressCommerce'
import type { WooAddItem, WooCartSnapshot } from './wooCart'

interface CartActions {
  setQuantity: (id: string, quantity: number) => void
  add: (id: string) => void
  addWooItem: (item: WooAddItem) => Promise<void>
  refreshWooCart: () => void
  setOpen: (open: boolean) => void
  dismissNotice: (id: number) => void
}
interface CartContextValue extends CartActions {
  lines: CartLine[]
  wooCart: WooCartSnapshot | null
  wooPending: boolean
  wooCheckoutUrl?: string
  wooCartStatus: 'loading' | 'ready' | 'error'
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
  const [commerce] = useState(wordpressCommerce)
  const [wooCartStatus, setWooCartStatus] = useState<CartContextValue['wooCartStatus']>(
    commerce ? 'loading' : 'ready',
  )
  const [wooCart, setWooCart] = useState<WooCartSnapshot | null>(null)
  const [wooPending, setWooPending] = useState(false)
  const wooInFlight = useRef(false)
  const wooToken = useRef<string | null>(null)
  const wooRead = useRef<AbortController>()
  const wooRestHeaders = useMemo(() => {
    const headers: Record<string, string> = {}
    if (commerce?.restNonce) headers['X-WP-Nonce'] = commerce.restNonce
    return headers
  }, [commerce])

  const refreshWooCart = useCallback(() => {
    if (!commerce || wooInFlight.current) return
    wooRead.current?.abort()
    const request = new AbortController()
    wooRead.current = request
    setWooCartStatus('loading')
    void fetch(wooCartEndpoint, {
      signal: request.signal, credentials: 'same-origin', cache: 'no-store', redirect: 'error', headers: wooRestHeaders,
    }).then(readWooCartResponse).then(cart => {
      if (request.signal.aborted) return
      setWooCart(cart)
      setWooCartStatus('ready')
    }).catch(() => {
      if (!request.signal.aborted) setWooCartStatus('error')
    })
  }, [commerce, wooRestHeaders])

  useEffect(() => {
    refreshWooCart()
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) refreshWooCart() }
    window.addEventListener('pageshow', onPageShow)
    return () => {
      wooRead.current?.abort()
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [refreshWooCart])
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
  const addWooItem = useCallback(async (item: WooAddItem) => {
    if ((!commerce && !import.meta.env.DEV) || wooInFlight.current) return
    wooInFlight.current = true
    wooRead.current?.abort()
    setWooPending(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...wooRestHeaders }
      if (commerce) {
        const current = await fetch(wooCartEndpoint, {
          credentials: 'same-origin', cache: 'no-store', redirect: 'error', headers: wooRestHeaders,
        })
        const cart = await readWooCartResponse(current)
        setWooCart(cart)
        setWooCartStatus('ready')
        const nonce = current.headers.get('Nonce')
        if (!nonce) throw new Error('No pudimos iniciar la sesión del carrito. Vuelve a intentarlo.')
        headers.Nonce = nonce
      } else {
        wooToken.current ??= crypto.randomUUID()
        headers['Cart-Token'] = wooToken.current
      }

      const response = await fetch(wooAddItemEndpoint, {
        method: 'POST',
        headers,
        credentials: commerce ? 'same-origin' : 'omit',
        redirect: 'error',
        body: JSON.stringify(item),
      })
      const cart = await readWooCartResponse(response)
      setWooCart(cart)
      setOpen(true)
    } catch (error) {
      if (commerce) setWooCartStatus(status => status === 'loading' ? 'error' : status)
      throw error
    } finally {
      wooInFlight.current = false
      setWooPending(false)
    }
  }, [commerce, wooRestHeaders])
  const dismissNotice = useCallback((id: number) => publish(cartReducer(current.current, { type: 'dismiss', id })), [publish])
  const actions = useMemo(() => ({ add, addWooItem, refreshWooCart, setQuantity, setOpen, dismissNotice }), [add, addWooItem, refreshWooCart, setQuantity, setOpen, dismissNotice])
  const count = state.lines.reduce((total, line) => total + line.quantity, wooCart?.items_count ?? 0)
  const value = useMemo(() => ({
    ...actions, lines: state.lines, wooCart, wooPending, wooCartStatus,
    wooCheckoutUrl: commerce?.checkoutUrl, notice: state.feedback, open, count,
  }), [actions, state.lines, state.feedback, wooCart, wooPending, wooCartStatus, commerce, open, count])
  return <CartActionsContext.Provider value={actions}><CartContext.Provider value={value}>{children}</CartContext.Provider></CartActionsContext.Provider>
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('Falta CartProvider'); return value }
export function useCartActions() { const value = useContext(CartActionsContext); if (!value) throw new Error('Falta CartProvider'); return value }

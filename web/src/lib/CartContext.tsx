import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../content/demo'
import { cartReducer, restoreCart } from './cart'
import type { CartAction, CartFeedback, CartLine, CartState } from './cart'
import { readWooCartResponse, wooCartEndpoint } from './wooCart'
import { wordpressCommerce } from './wordpressCommerce'
import type { WooAddItem, WooCartSnapshot } from './wooCart'

interface CartActions {
  setQuantity: (id: string, quantity: number) => void
  add: (id: string) => void
  addWooItem: (item: WooAddItem) => Promise<void>
  changeWooItem: (key: string, quantity: number) => Promise<void>
  refreshWooCart: () => void
  setOpen: (open: boolean) => void
  dismissNotice: (id: number) => void
}
interface CartContextValue extends CartActions {
  lines: CartLine[]
  wooCart: WooCartSnapshot | null
  wooNotice: string
  wooPending: boolean
  wooCartFallbackUrl?: string
  wooNativeCartUrl?: string
  wooCheckoutUrl?: string
  wooCartStatus: 'loading' | 'ready' | 'error'
  open: boolean
  count: number
  notice: CartFeedback | null
}
const CartContext = createContext<CartContextValue | null>(null)
const CartActionsContext = createContext<CartActions | null>(null)
const cartRequestTimeout = 15_000
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
  const [wooNotice, setWooNotice] = useState('')
  const wooInFlight = useRef(false)
  const nonce = useRef<string | null>(null)
  const wooToken = useRef<string | null>(null)
  const wooRead = useRef<AbortController>()
  const wooRestHeaders = useMemo(() => {
    const headers: Record<string, string> = {}
    if (commerce?.restNonce) headers['X-WP-Nonce'] = commerce.restNonce
    return headers
  }, [commerce])

  const readSession = useCallback(async (signal: AbortSignal) => {
    const response = await fetch(wooCartEndpoint, {
      signal, credentials: 'same-origin', cache: 'no-store', redirect: 'error', headers: wooRestHeaders,
    })
    const cart = await readWooCartResponse(response)
    signal.throwIfAborted()
    nonce.current = response.headers.get('Nonce')
    setWooCart(cart)
    setWooCartStatus('ready')
  }, [wooRestHeaders])

  const refreshWooCart = useCallback(() => {
    if (!commerce || wooInFlight.current) return
    wooRead.current?.abort()
    const request = new AbortController()
    wooRead.current = request
    setWooCartStatus('loading')
    void readSession(AbortSignal.any([request.signal, AbortSignal.timeout(cartRequestTimeout)])).catch(() => {
      if (!request.signal.aborted) setWooCartStatus('error')
    })
  }, [commerce, readSession])

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
  const writeWooCart = useCallback(async (
    operation: 'add-item' | 'update-item' | 'remove-item',
    body: WooAddItem | { key: string; quantity?: number },
  ) => {
    if ((!commerce && !import.meta.env.DEV) || wooInFlight.current) return
    wooInFlight.current = true
    wooRead.current?.abort()
    setWooNotice('')
    setWooPending(true)
    let submitted = false
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...wooRestHeaders }
      if (commerce) {
        if (!nonce.current) await readSession(AbortSignal.timeout(cartRequestTimeout))
        if (!nonce.current) throw new Error('No pudimos iniciar la sesión del carrito.')
        headers.Nonce = nonce.current
      } else {
        wooToken.current ??= crypto.randomUUID()
        headers['Cart-Token'] = wooToken.current
      }
      submitted = true
      const response = await fetch(`${wooCartEndpoint}/${operation}`, {
        method: 'POST', headers, credentials: commerce ? 'same-origin' : 'omit',
        redirect: 'error', body: JSON.stringify(body), signal: AbortSignal.timeout(cartRequestTimeout),
      })
      const cart = await readWooCartResponse(response)
      nonce.current = response.headers.get('Nonce') ?? nonce.current
      setWooCart(cart)
      setWooCartStatus('ready')
      if (operation === 'add-item') setOpen(true)
    } catch (error) {
      nonce.current = null
      if (commerce) {
        setWooCartStatus('error')
        // Un fallo de red puede llegar después de que WooCommerce haya aplicado el cambio.
        // Leemos la sesión antes de permitir otro intento para evitar duplicar unidades.
        if (submitted) {
          try { await readSession(AbortSignal.timeout(cartRequestTimeout)) }
          catch { setWooCartStatus('error') }
          if (operation === 'add-item') {
            setWooNotice(error instanceof TypeError || error instanceof DOMException
              ? 'Revisa las cantidades antes de volver a añadir el producto.'
              : error instanceof Error ? error.message : 'No pudimos confirmar la operación.')
            setOpen(true)
          }
        }
      }
      if (error instanceof TypeError || error instanceof DOMException) {
        throw new Error(submitted ? 'Revisa el carrito antes de repetir la operación.' : 'No pudimos consultar el carrito. Vuelve a intentarlo.')
      }
      throw error
    } finally {
      wooInFlight.current = false
      setWooPending(false)
    }
  }, [commerce, readSession, wooRestHeaders])
  const addWooItem = useCallback((item: WooAddItem) => writeWooCart('add-item', item), [writeWooCart])
  const changeWooItem = useCallback((key: string, quantity: number) => quantity === 0
    ? writeWooCart('remove-item', { key })
    : writeWooCart('update-item', { key, quantity }), [writeWooCart])
  const dismissNotice = useCallback((id: number) => publish(cartReducer(current.current, { type: 'dismiss', id })), [publish])
  const actions = useMemo(() => ({ add, addWooItem, changeWooItem, refreshWooCart, setQuantity, setOpen, dismissNotice }), [add, addWooItem, changeWooItem, refreshWooCart, setQuantity, setOpen, dismissNotice])
  const count = state.lines.reduce((total, line) => total + line.quantity, wooCart?.items_count ?? 0)
  const value = useMemo(() => ({
    ...actions, lines: state.lines, wooCart, wooNotice, wooPending, wooCartStatus,
    wooCartFallbackUrl: commerce?.cartFallbackUrl, wooNativeCartUrl: commerce?.cartUrl, wooCheckoutUrl: commerce?.checkoutUrl, notice: state.feedback, open, count,
  }), [actions, state.lines, state.feedback, wooCart, wooNotice, wooPending, wooCartStatus, commerce, open, count])
  return <CartActionsContext.Provider value={actions}><CartContext.Provider value={value}>{children}</CartContext.Provider></CartActionsContext.Provider>
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('Falta CartProvider'); return value }
export function useCartActions() { const value = useContext(CartActionsContext); if (!value) throw new Error('Falta CartProvider'); return value }

export interface CartLine { id: string; quantity: number }
export function updateCart(lines: CartLine[], id: string, quantity: number): CartLine[] {
  if (!Number.isFinite(quantity)) return lines
  if (quantity < 1) return lines.filter(line => line.id !== id)
  const next = { id, quantity: Math.min(99, Math.floor(quantity)) }
  return lines.some(line => line.id === id) ? lines.map(line => line.id === id ? next : line) : [...lines, next]
}
export function restoreCart(raw: string | null, validIds: string[]): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.reduce<CartLine[]>((lines, line) => {
      if (line && validIds.includes(line.id) && Number.isInteger(line.quantity) && line.quantity > 0) {
        return updateCart(lines, line.id, line.quantity)
      }
      return lines
    }, [])
  } catch { return [] }
}

export interface CartFeedback { id: number; kind: 'added' | 'limit'; message: string }
export interface CartState { lines: CartLine[]; feedback: CartFeedback | null; revision: number }
export type CartAction =
  | { type: 'add'; product: { id: string; name: string } }
  | { type: 'quantity'; id: string; quantity: number }
  | { type: 'dismiss'; id: number }

/** Quantity and feedback change atomically, including rapid repeated clicks. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'dismiss') return state.feedback?.id === action.id ? { ...state, feedback: null } : state
  if (action.type === 'quantity') return { ...state, lines: updateCart(state.lines, action.id, action.quantity) }
  const quantity = state.lines.find(line => line.id === action.product.id)?.quantity ?? 0
  const revision = state.revision + 1
  const limited = quantity >= 99
  return {
    lines: limited ? state.lines : updateCart(state.lines, action.product.id, quantity + 1),
    revision,
    feedback: {
      id: revision,
      kind: limited ? 'limit' : 'added',
      message: limited ? `${action.product.name}: puedes guardar hasta 99 unidades.` : `${action.product.name} agregado al carrito`,
    },
  }
}

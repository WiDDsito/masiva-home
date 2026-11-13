export interface CartLine { id: string; quantity: number }
export function updateCart(lines: CartLine[], id: string, quantity: number): CartLine[] {
  if (!Number.isFinite(quantity)) return lines
  const next = lines.filter(line => line.id !== id)
  if (quantity >= 1) next.push({ id, quantity: Math.min(99, Math.floor(quantity)) })
  return next
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

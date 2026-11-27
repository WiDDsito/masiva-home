interface BridgeSettings {
  cartUrl?: unknown
  checkoutUrl?: unknown
  restNonce?: unknown
}

function storeUrl(path: unknown) {
  if (typeof path !== 'string' || !path.trim()) return undefined
  try {
    const url = new URL(path, window.location.origin)
    if (url.origin === window.location.origin && !url.username && !url.password && !url.hash) return url.href
  } catch {
    return undefined
  }
}

// Si el puente omite la página del carrito, el destino acordado es el pago de la tienda.
const masivaCheckout = 'https://masivahome.com/finalizar-compra/'

export function wordpressCommerce() {
  const settings = (window as Window & { MASIVA_FRONT?: BridgeSettings }).MASIVA_FRONT
  if (!settings && !document.getElementById('mh-frontend-bridge-css')) return null

  const checkoutUrl = storeUrl(settings?.checkoutUrl ?? '/finalizar-compra/')
  if (!checkoutUrl) return null
  return {
    checkoutUrl,
    cartUrl: storeUrl(settings?.cartUrl),
    cartFallbackUrl: masivaCheckout,
    restNonce: typeof settings?.restNonce === 'string' ? settings.restNonce : undefined,
  }
}

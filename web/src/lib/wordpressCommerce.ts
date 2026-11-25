interface BridgeSettings {
  checkoutUrl?: unknown
  restNonce?: unknown
}

export function wordpressCommerce() {
  const settings = (window as Window & { MASIVA_FRONT?: BridgeSettings }).MASIVA_FRONT
  if (!settings && !document.getElementById('mh-frontend-bridge-css')) return null

  const path = settings?.checkoutUrl ?? '/finalizar-compra/'
  if (typeof path !== 'string') return null

  try {
    const url = new URL(path, window.location.origin)
    if (url.origin !== window.location.origin || url.username || url.password || url.hash) return null
    return {
      checkoutUrl: url.href,
      restNonce: typeof settings?.restNonce === 'string' ? settings.restNonce : undefined,
    }
  } catch {
    return null
  }
}

import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.env.URL ?? 'http://127.0.0.1:5186/'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const currency = { currency_code: 'PEN', currency_minor_unit: 2 }
const prices = { ...currency, price: '106600' }
const simple = { type: 'simple', is_purchasable: true, is_in_stock: true, prices }
const escanor = { id: 8392, name: 'Aparador Escanor', ...simple }
const emma = { id: 8404, name: 'Aparador Emma', ...simple }
const choice = { name: 'Color', value: 'blanco-y-dorado' }
const arian = {
  ...simple, type: 'variable', id: 8428, name: 'Aparador Arian',
  attributes: [{
    name: 'Color', taxonomy: 'pa_color', has_variations: true,
    terms: [{ name: 'Blanco y dorado', slug: choice.value }],
  }],
  variations: [{ id: 8463, attributes: [choice] }],
}
const variant = { ...simple, type: 'variation', id: 8463, parent: 8428, name: 'Arian blanco y dorado' }

try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    await page.addInitScript(() => {
      window.MASIVA_FRONT = { checkoutUrl: '/finalizar-compra/', restNonce: 'test-rest-nonce' }
      localStorage.setItem('mh-theme', 'dark')
    })
    await page.route(base + '**', async route => {
      if (route.request().isNavigationRequest() && new URL(route.request().url()).pathname === '/') {
        const response = await route.fetch()
        const body = await response.text()
        await route.fulfill({ response, body: body
          .replace(/<script>[\s\S]*?<\/script>/, '')
          .replace('</head>', '<style>.wp-theme-blocksy h1,.wp-theme-blocksy h2,.wp-theme-blocksy h3{color:#191817}</style></head>')
          .replace('<body>', '<body class="wp-theme-blocksy">') })
      } else await route.fallback()
    })
    await page.route('**/wp-json/wc/store/v1/products**', route => {
      const url = new URL(route.request().url())
      if (url.pathname.endsWith('/categories')) return route.fulfill({ json: [] })
      const id = Number(url.pathname.split('/').at(-1))
      if (id) return route.fulfill({ json: [escanor, emma, arian].find(product => product.id === id) })
      if (url.searchParams.get('include') === '8392,8404') return route.fulfill({ json: [escanor, emma] })
      const rows = url.searchParams.has('parent') ? [variant] : [arian, emma]
      return route.fulfill({ json: rows, headers: { 'X-WP-Total': String(rows.length), 'X-WP-TotalPages': '1' } })
    })

    const added = []
    const sessionLines = []
    const snapshot = () => ({
      items: sessionLines,
      items_count: sessionLines.length,
      totals: { ...currency, total_items: String(106600 * sessionLines.length), total_price: '0' },
    })
    await page.route('**/wp-json/wc/store/v1/cart', route => {
      assert.equal(route.request().headers()['x-wp-nonce'], 'test-rest-nonce')
      return route.fulfill({ json: snapshot(), headers: { Nonce: 'test-cart-nonce' } })
    })
    await page.route('**/wp-json/wc/store/v1/cart/add-item', route => {
      const request = route.request()
      assert.equal(request.headers().nonce, 'test-cart-nonce')
      assert.equal(request.headers()['cart-token'], undefined)
      const item = request.postDataJSON()
      added.push(item)
      sessionLines.push({
        id: item.id, key: String(item.id), name: item.id === emma.id ? emma.name : arian.name,
        quantity: item.quantity, prices, images: [], variation: item.variation ?? [],
        totals: { ...currency, line_total: prices.price },
      })
      return route.fulfill({
        json: snapshot(),
        headers: { 'Set-Cookie': 'wp_woocommerce_session_test=checkout-session; Path=/; SameSite=Lax' },
      })
    })
    await page.route('**/finalizar-compra/', route => {
      assert.match(route.request().headers().cookie, /wp_woocommerce_session_test=checkout-session/)
      return route.fulfill({ contentType: 'text/html', body: '<h1>Checkout nativo de prueba</h1>' })
    })

    await page.goto(base + '#tienda')
    const shop = page.locator('#tienda')
    assert.equal(await shop.getByRole('link', { name: 'Ver producto: Aparador Escanor' }).getAttribute('href'), '#producto/8392')
    await shop.getByRole('link', { name: 'Ver producto: Aparador Emma' }).click()
    await page.getByRole('heading', { name: emma.name, exact: true }).waitFor()
    assert.match(page.url(), /#producto\/8404$/)
    assert.equal(await page.getByText('Abrir ficha de WooCommerce', { exact: true }).count(), 0)

    await page.getByRole('button', { name: 'Añadir al carrito', exact: true }).click()
    const cart = page.getByRole('dialog', { name: 'Tu carrito' })
    await cart.getByRole('button', { name: 'Finalizar compra', exact: true }).click()
    const summary = page.getByRole('complementary', { name: 'Resumen del pedido' })
    assert.match(await summary.innerText(), /Aparador Emma/)
    assert.match(await summary.innerText(), /Subtotal de WooCommerce/)
    await page.reload()
    await summary.getByText('Aparador Emma', { exact: true }).waitFor()
    await page.getByRole('link', { name: 'Continuar al pago' }).click()
    await page.getByRole('heading', { name: 'Checkout nativo de prueba' }).waitFor()
    assert.match(page.url(), /\/finalizar-compra\/$/)

    await page.goto(base + '#catalogo')
    const productCard = page.getByRole('link', { name: 'Ver producto: Aparador Arian' })
    await productCard.waitFor()
    for (const heading of [page.getByRole('heading', { name: 'Todos los muebles' }), productCard.getByRole('heading')]) {
      assert.equal(await heading.evaluate(node => getComputedStyle(node).color), 'rgb(245, 243, 239)')
    }
    await productCard.click()
    await page.getByRole('combobox', { name: 'Color' }).selectOption('blanco-y-dorado')
    await page.getByRole('button', { name: 'Añadir al carrito', exact: true }).click()
    await cart.getByText('Aparador Arian', { exact: true }).waitFor()
    assert.deepEqual(added, [
      { id: 8404, quantity: 1 },
      { id: 8463, quantity: 1, variation: [{ attribute: 'pa_color', value: choice.value }] },
    ])
    console.log('PASS ' + width + ': destacados WooCommerce, fichas internas, contraste oscuro, checkout y variante')
    await page.close()
  }
} finally {
  await browser.close()
}

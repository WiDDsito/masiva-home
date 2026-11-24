import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const base = process.env.URL ?? 'http://127.0.0.1:5182/'

try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base + '#inicio', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Agregar Aparador Escanor al carrito', exact: true }).click()
    await page.getByRole('button', { name: 'Carrito, 1 productos', exact: true }).click()

    const cart = page.getByRole('dialog', { name: 'Tu carrito' })
    await cart.getByRole('button', { name: 'Finalizar compra', exact: true }).click({ timeout: 2500 })
    await page.getByRole('heading', { name: 'Finalizar compra', exact: true }).waitFor()
    assert.match(page.url(), /#finalizar-compra$/)
    await cart.waitFor({ state: 'hidden' })
    await page.waitForFunction(() => document.activeElement?.id === 'contenido')
    const summary = page.getByRole('complementary', { name: 'Resumen del pedido' })
    assert.match(await summary.innerText(), /Aparador Escanor/)
    assert.match(await summary.innerText(), /959/)
    assert.equal(await page.getByRole('button', { name: 'Realizar pedido', exact: true }).isDisabled(), true)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)

    await page.getByRole('button', { name: 'Volver al carrito', exact: true }).click()
    await cart.getByRole('button', { name: 'Aumentar cantidad de Aparador Escanor' }).click()
    await cart.getByRole('button', { name: 'Finalizar compra', exact: true }).click()
    await cart.waitFor({ state: 'hidden' })
    assert.match(await summary.innerText(), /1[.,]918/)
    await page.reload({ waitUntil: 'domcontentloaded' })
    assert.match(await summary.innerText(), /2 unidades/)
    if (process.env.SHOTS_DIR) await page.locator('.checkout').screenshot({ path: process.env.SHOTS_DIR + '/checkout-' + width + '.png' })
    await page.getByRole('button', { name: 'Volver al carrito', exact: true }).click()
    await cart.getByRole('button', { name: 'Eliminar Aparador Escanor', exact: true }).click()
    await cart.getByRole('button', { name: 'Cerrar carrito', exact: true }).click()
    await cart.waitFor({ state: 'hidden' })
    await summary.getByText('Tu carrito está vacío.').waitFor()
    assert.deepEqual(errors, [])
    console.log('PASS ' + width + ': checkout, resumen, cantidades, recarga y carrito vacío')
    await page.close()
  }
  const wooPage = await browser.newPage({ reducedMotion: 'reduce' })
  const currency = { currency_code: 'PEN', currency_minor_unit: 2 }
  const prices = { ...currency, price: '86000' }
  const product = {
    id: 9248, name: 'Haru', type: 'simple', is_in_stock: true, is_purchasable: true, prices,
  }
  await wooPage.route('**/wp-json/wc/store/v1/products/9248', route => route.fulfill({ json: product }))
  await wooPage.route('**/wp-json/wc/store/v1/cart/add-item', route => route.fulfill({
    json: {
      items: [{
        id: product.id, key: 'haru', name: product.name, quantity: 1, images: [], prices,
        variation: [], totals: { ...currency, line_total: '86000' },
      }],
      items_count: 1,
      totals: { ...currency, total_items: '86000', total_price: '86000' },
    },
  }))
  await wooPage.goto(base + '#producto/9248', { waitUntil: 'domcontentloaded' })
  await wooPage.getByRole('button', { name: 'Añadir al carrito', exact: true }).click()
  await wooPage.getByRole('dialog', { name: 'Tu carrito' }).getByRole('button', { name: 'Finalizar compra' }).click()
  const wooSummary = wooPage.getByRole('complementary', { name: 'Resumen del pedido' })
  assert.match(await wooSummary.innerText(), /Haru/)
  assert.match(await wooSummary.innerText(), /Subtotal simulado/)
  assert.match(await wooSummary.innerText(), /860/)
  assert.equal(await wooPage.getByRole('button', { name: 'Realizar pedido' }).isDisabled(), true)
  console.log('PASS: el checkout muestra el carrito simulado de WooCommerce')
  await wooPage.close()
} finally {
  await browser.close()
}

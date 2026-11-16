import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const url = process.env.URL ?? 'http://127.0.0.1:5195/'
const failures = []
async function check(name, test) {
  try { await test(); console.log(`PASS ${name}`) }
  catch (error) { failures.push(name); console.error(`FAIL ${name}: ${error.message}`) }
}
try {
  await check('Bolsa: orden estable, salida animada y retorno del foco', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'no-preference' })
    try {
      await page.goto(`${url}#catalogo`)
      for (const name of ['Aparador Escanor', 'Mesa de centro Fabela']) await page.getByRole('button', { name: `Agregar ${name} al carrito`, exact: true }).click()
      await page.getByRole('button', { name: 'Carrito, 2 productos', exact: true }).waitFor()
      const opener = page.getByRole('banner').getByRole('button', { name: /^Carrito,/ })
      await opener.click()
      const before = await page.locator('.cart-lines h3').allTextContents()
      await page.getByRole('button', { name: 'Aumentar cantidad de Aparador Escanor', exact: true }).click()
      await page.getByRole('button', { name: 'Carrito, 3 productos', exact: true }).waitFor({ state: 'attached' })
      assert.deepEqual(await page.locator('.cart-lines h3').allTextContents(), before)
      await page.evaluate(() => document.querySelector('[aria-label="Cerrar carrito"]').click())
      const closing = await page.locator('#shopping-bag').evaluate(el => ({ open: el.open, closing: el.dataset.closing, moving: el.getAnimations().some(a => a.playState === 'running') }))
      assert.ok(closing.open && closing.closing === 'true' && closing.moving, 'La bolsa debe permanecer en la capa modal durante la salida')
      await page.waitForFunction(() => !document.querySelector('#shopping-bag').open)
      assert.ok(await opener.evaluate(el => el === document.activeElement))
      await opener.click()
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('#shopping-bag').open)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await opener.click()
      await page.getByRole('button', { name: 'Cerrar carrito', exact: true }).click()
      await page.waitForFunction(() => !document.querySelector('#shopping-bag').open)
    } finally { await page.close() }
  })
  await check('Sin WebGL: fotografías reales, selección, compra y catálogo', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' })
    try {
      await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext
        HTMLCanvasElement.prototype.getContext = function (type, ...args) { return /webgl/.test(type) ? null : getContext.call(this, type, ...args) }
      })
      await page.goto(url)
      await page.locator('#showroom').scrollIntoViewIfNeeded()
      const photo = page.locator('.showroom__photos img')
      await photo.waitFor({ timeout: 4000 })
      assert.ok(await photo.evaluate(el => el.complete && el.naturalWidth > 0))
      assert.equal(await page.locator('.showroom__tools').count(), 0)
      assert.ok(!(await page.locator('#showroom-help').innerText()).includes('Arrastra'))
      const first = await photo.getAttribute('src')
      await page.getByRole('tab', { name: 'Dormitorio', exact: true }).click()
      assert.notEqual(await photo.getAttribute('src'), first)
      await page.locator('.showroom__legend').getByRole('button', { name: 'Ropero', exact: true }).click()
      await page.getByRole('button', { name: 'Agregar Ropero Runa al carrito', exact: true }).click()
      await page.getByRole('button', { name: 'Carrito, 1 productos', exact: true }).waitFor()
      await page.getByRole('link', { name: 'Ver fotos y medidas', exact: true }).click()
      await page.getByRole('heading', { name: 'Catálogo de muebles', exact: true }).waitFor()
      assert.equal(await page.getByLabel('Filtrar por categoría').inputValue(), 'dormitorio')
    } finally { await page.close() }
  })
  await check('Movimiento reducido específico, contenido visible y feedback de color', async () => {
    assert.ok(!/animation-duration:\s*0?\.01ms/.test(readFileSync('src/styles/base.css', 'utf8')), 'No debe haber un reinicio global de 0.01ms')
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' })
    try {
      await page.goto(url)
      assert.equal(await page.locator('video').getAttribute('src'), null)
      const button = page.locator('.hero__actions .btn--primary')
      await button.hover()
      assert.equal(await button.evaluate(el => getComputedStyle(el).transform), 'none')
      assert.match(await button.evaluate(el => getComputedStyle(el).transitionProperty), /background-color/)
      assert.equal(await page.locator('.hero__title').evaluate(el => getComputedStyle(el).opacity), '1')
      await button.click()
      await page.getByRole('link', { name: 'Ver catálogo completo', exact: true }).click()
      await page.getByRole('heading', { name: 'Catálogo de muebles', exact: true }).waitFor()
    } finally { await page.close() }
  })
  await check('3D disponible y recuperación al perder el contexto', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    try {
      await page.goto(url)
      await page.locator('#showroom').scrollIntoViewIfNeeded()
      await page.waitForFunction(() => document.querySelector('canvas')?.dataset.cameraMoving === 'false')
      assert.equal(await page.locator('.showroom__photos').count(), 0)
      await page.locator('.showroom__legend').getByRole('button', { name: 'Centro de mesa', exact: true }).click()
      await page.locator('canvas').evaluate(el => el.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
      await page.locator('.showroom__photos img').waitFor()
      assert.match(await page.locator('.showroom__caption.has-selection').innerText(), /S\/ 659\.00/)
      assert.equal(await page.locator('.showroom__tools').count(), 0)
    } finally { await page.close() }
  })
} finally { await browser.close() }
if (failures.length) process.exitCode = 1

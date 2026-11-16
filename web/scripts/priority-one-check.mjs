import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const url = process.env.URL ?? 'http://127.0.0.1:5193/'
const failures = []
async function check(name, test) {
  try { await test(); console.log(`PASS ${name}`) }
  catch (error) { failures.push(name); console.error(`FAIL ${name}: ${error.message}`) }
}
try {
  await check('Bolsa compartida entre pestañas y operaciones simultáneas', async () => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    try {
      const a = await context.newPage(), b = await context.newPage()
      await Promise.all([a.goto(`${url}#catalogo`), b.goto(`${url}#catalogo`)])
      await a.getByRole('button', { name: 'Agregar Aparador Escanor al carrito', exact: true }).click()
      await b.getByRole('button', { name: 'Carrito, 1 productos', exact: true }).waitFor({ timeout: 3000 })
      await b.getByRole('button', { name: 'Agregar Mesa de centro Fabela al carrito', exact: true }).click()
      await a.getByRole('button', { name: 'Carrito, 2 productos', exact: true }).waitFor()
      const addMany = page => page.evaluate(() => {
        const button = document.querySelector('[aria-label="Agregar Aparador Escanor al carrito"]')
        for (let i = 0; i < 5; i++) button.click()
      })
      await Promise.all([addMany(a), addMany(b)])
      await Promise.all([a, b].map(page => page.getByRole('button', { name: 'Carrito, 12 productos', exact: true }).waitFor()))
      await a.getByRole('button', { name: 'Carrito, 12 productos', exact: true }).click()
      await a.getByRole('button', { name: 'Eliminar Mesa de centro Fabela', exact: true }).click()
      await b.getByRole('button', { name: 'Carrito, 11 productos', exact: true }).waitFor()
      await b.reload()
      await b.getByRole('button', { name: 'Carrito, 11 productos', exact: true }).waitFor()
      await b.evaluate(() => localStorage.removeItem('mh-cart-v1'))
      await a.getByRole('heading', { name: 'Tu próximo mueble te espera.', exact: true }).waitFor()
    } finally { await context.close() }
  })
  await check('Ficha móvil fuera del visor, precio y compra accesibles', async () => {
    for (const width of [320, 390, 640]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      try {
        await page.goto(url)
        await page.locator('#showroom').scrollIntoViewIfNeeded()
        await page.waitForFunction(() => document.querySelector('canvas')?.dataset.cameraMoving === 'false')
        await page.locator('.showroom__legend').getByRole('button', { name: 'Centro de mesa', exact: true }).click()
        const panel = page.locator('.showroom__caption.has-selection')
        const stage = await page.locator('.showroom__stage').boundingBox()
        const caption = await panel.boundingBox()
        assert.ok(caption.y >= stage.y + stage.height - 1, `La ficha tapa el visor a ${width}px`)
        await panel.getByRole('button', { name: 'Agregar Mesa de centro Fabela al carrito', exact: true }).click()
        await page.getByRole('button', { name: 'Carrito, 1 productos', exact: true }).waitFor()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      } finally { await page.close() }
    }
  })
  await check('Destinos del pie: categorías filtradas y ayuda real', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    try {
      await page.goto(url)
      const categories = await page.locator('nav[aria-labelledby="footer-tienda"] a').evaluateAll(links => links.map(link => ({ name: link.textContent, href: link.getAttribute('href') })))
      for (const item of categories) {
        assert.ok(item.href.startsWith('#catalogo?categoria='), `${item.name} no filtra el catálogo`)
        await page.locator('nav[aria-labelledby="footer-tienda"]').getByRole('link', { name: item.name, exact: true }).click()
        await page.waitForFunction(href => location.hash === href, item.href)
        await page.waitForFunction(category => document.querySelector('[aria-label="Filtrar por categoría"]')?.value === category, item.href.split('=')[1])
        assert.equal(await page.getByLabel('Filtrar por categoría').inputValue(), item.href.split('=')[1])
      }
      for (const name of ['Preguntas frecuentes', 'Entrega y recojo', 'Garantía']) {
        await page.locator('nav[aria-labelledby="footer-ayuda"]').getByRole('link', { name, exact: true }).click()
        await page.getByRole('heading', { name, exact: true }).waitFor()
        assert.ok(await page.locator('main').getByRole('link', { name: /WhatsApp/ }).isVisible())
        await page.reload()
        await page.getByRole('heading', { name, exact: true }).waitFor()
      }
      await page.getByRole('link', { name: 'Buscar productos', exact: true }).click()
      await page.getByRole('heading', { name: 'Catálogo de muebles', exact: true }).waitFor()
      assert.ok(await page.getByLabel('Buscar en el catálogo').evaluate(el => el === document.activeElement))
    } finally { await page.close() }
  })
  await check('Bolsa en memoria cuando el almacenamiento o los bloqueos no están disponibles', async () => {
    for (const blockedStorage of [false, true]) {
      const page = await browser.newPage({ reducedMotion: 'reduce' })
      try {
        await page.addInitScript(blocked => {
          Object.defineProperty(navigator, 'locks', { value: undefined })
          if (blocked) Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError') }
        }, blockedStorage)
        await page.goto(`${url}#catalogo`)
        const add = page.getByRole('button', { name: 'Agregar Aparador Escanor al carrito', exact: true })
        await add.click(); await add.click()
        await page.getByRole('button', { name: 'Carrito, 2 productos', exact: true }).waitFor()
      } finally { await page.close() }
    }
  })
} finally { await browser.close() }
if (failures.length) process.exitCode = 1

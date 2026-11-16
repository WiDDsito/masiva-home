import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const url = process.env.URL ?? 'http://127.0.0.1:5197/'
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' })
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await page.locator('.site-header--entering').waitFor({ timeout: 1000 })
      const entrance = await page.locator('.site-header').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.animationName === 'menu-link-enter').map(a => ({ target: a.effect.target.className, duration: a.effect.getTiming().duration })))
      assert.equal(entrance.length, width > 900 ? 5 : 1)
      assert.ok(entrance.every(a => a.duration > 0))
      assert.equal(await page.locator('.brand').first().evaluate(el => el.getAnimations().length), 0)
      assert.equal(await page.locator('.header__actions > :not(.menu-btn)').evaluateAll(nodes => nodes.reduce((n, el) => n + el.getAnimations().length, 0)), 0)
      if (width > 900) {
        await page.getByRole('button', { name: 'Tienda', exact: true }).hover()
        const menu = await page.locator('#mega-tienda').boundingBox()
        assert.ok(menu.width >= width * .9, 'La entrada no debe cambiar el anclaje del desplegable')
      }
      await page.waitForFunction(() => !document.querySelector('.site-header').classList.contains('site-header--entering'))
      await page.getByRole('link', { name: 'Ver catálogo completo', exact: true }).click()
      await page.getByRole('heading', { name: 'Catálogo de muebles', exact: true }).waitFor()
      assert.equal(await page.locator('.site-header--entering').count(), 0)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      console.log(`PASS ${width}: entrada solo del menú, anclaje conservado y sin repetición al navegar`)
    } finally { await page.close() }
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  try {
    await page.goto(url)
    assert.equal(await page.locator('.site-header--entering').count(), 0)
    assert.equal(await page.locator('.site-header').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.animationName === 'menu-link-enter').length), 0)
    await page.getByRole('button', { name: 'Tienda', exact: true }).focus()
    await page.keyboard.press('ArrowDown')
    await page.waitForFunction(() => document.activeElement?.classList.contains('mega__all'))
    console.log('PASS movimiento reducido y acceso por teclado')
  } finally { await page.close() }
} finally { await browser.close() }

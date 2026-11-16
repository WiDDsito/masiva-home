import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const url = process.env.URL ?? 'http://127.0.0.1:5196/'
try {
  for (const route of ['#inicio', '#catalogo']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
    try {
      await page.goto(`${url}${route}`, { waitUntil: 'networkidle' })
      const opener = page.getByRole('banner').getByRole('button', { name: /^Carrito,/ })
      await opener.click()
      await page.waitForTimeout(350)
      const frames = await page.evaluate(async () => {
        const dialog = document.querySelector('#shopping-bag')
        const startX = dialog.getBoundingClientRect().x, width = dialog.getBoundingClientRect().width
        document.querySelector('[aria-label="Cerrar carrito"]').click()
        const start = performance.now(), frames = []
        while (performance.now() - start < 180) {
          const elapsed = performance.now() - start
          frames.push({ ms: elapsed, open: dialog.open, opacity: Number(getComputedStyle(dialog).opacity), progress: (dialog.getBoundingClientRect().x - startX) / width })
          await new Promise(requestAnimationFrame)
        }
        return frames
      })
      const middle = frames.filter(frame => frame.ms >= 70 && frame.ms <= 150)
      assert.ok(middle.length >= 2)
      assert.ok(middle.every(frame => frame.open && frame.opacity > .95 && frame.progress < .85), 'El panel debe seguir visible durante la parte central de la salida')
      await page.waitForFunction(() => !document.querySelector('#shopping-bag').open)
      assert.ok(await opener.evaluate(el => el === document.activeElement))
      await opener.click()
      assert.ok(await page.locator('#shopping-bag').isVisible())
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('#shopping-bag').open)
      console.log(`PASS ${route}: salida gradual visible, foco y reapertura`)
    } finally { await page.close() }
  }
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' })
    try {
      // The hero must not wait for the optional scroll-animation bundle.
      await page.route(/(?:gsap|ScrollTrigger).*\.js/, async route => { await new Promise(resolve => setTimeout(resolve, 1800)); await route.continue().catch(() => {}) })
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await page.locator('.hero--entering').waitFor({ timeout: 1200 })
      const names = await page.locator('.hero').evaluate(el => el.getAnimations({ subtree: true }).map(animation => animation.animationName))
      assert.ok(names.includes('hero-media-enter'))
      assert.ok(names.includes('hero-copy-enter'))
      await page.waitForFunction(() => !document.querySelector('.hero').classList.contains('hero--entering'))
      assert.equal(await page.locator('.hero__lead').evaluate(el => getComputedStyle(el).opacity), '1')
      await page.getByRole('link', { name: 'Ver catálogo completo', exact: true }).click()
      await page.getByRole('heading', { name: 'Catálogo de muebles', exact: true }).waitFor()
      await page.getByRole('banner').getByRole('link', { name: 'Masiva Home, ir al inicio', exact: true }).click()
      await page.locator('.hero').waitFor()
      assert.equal(await page.locator('.hero--entering').count(), 0)
      console.log(`PASS ${width}: entrada coordinada sin esperar GSAP, sin repetirse al volver`)
    } finally { await page.close() }
  }
} finally { await browser.close() }

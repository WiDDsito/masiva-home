/**
 * Comprobación de movimiento y hover.
 * Uso: npm run check:motion (requiere el servidor de Vite activo).
 */
import { chromium } from 'playwright-core'

const url = process.env.URL ?? 'http://localhost:5173/'
const browser = await chromium.launch({ channel: 'chrome' })

const failures = []
const check = (name, condition) => {
  if (!condition) failures.push(name)
  console.log(`${condition ? 'ok' : 'FALLA'} ${name}`)
}

for (const scheme of ['light', 'dark']) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })

  const link = page.locator('.nav__link').nth(2)
  const before = await link.evaluate((el) => getComputedStyle(el).color)
  await link.hover()
  await page.waitForTimeout(320)
  const after = await link.evaluate((el) => getComputedStyle(el).color)

  const expected = scheme === 'light' ? 'rgb(118, 86, 41)' : 'rgb(208, 174, 118)'
  check(`nav se pinta de dorado en ${scheme}`, before !== expected && after === expected)

  const header = page.locator('.site-header')
  check(`cabecera sin compactar en ${scheme}`, (await header.getAttribute('class'))?.includes('is-scrolled') === false)

  const belowFold = page.locator('.section__head').nth(1)
  const initialOpacity = await belowFold.evaluate((el) => getComputedStyle(el).opacity)
  check(`contenido bajo el pliegue comienza oculto en ${scheme}`, initialOpacity === '0')

  await page.evaluate(() => {
    document.querySelector('#servicios')?.scrollIntoView({ block: 'start' })
  })
  await page.waitForTimeout(1200)

  const revealedOpacity = await belowFold.evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity))
  check(`el contenido aparece al entrar en pantalla en ${scheme}`, revealedOpacity >= 0.95)

  const headerHeight = await page.locator('.header__inner').evaluate((el) => getComputedStyle(el).minHeight)
  check(`la cabecera se compacta al desplazar en ${scheme}`, headerHeight === '60px')

  await context.close()
}

// Con movimiento reducido, nada queda oculto.
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })

  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-reveal]')).some(
      (el) => getComputedStyle(el).opacity === '0',
    ),
  )
  check('con movimiento reducido todo el contenido es visible', hidden === false)

  await context.close()
}

await browser.close()

if (failures.length > 0) {
  console.error(`\n${failures.length} comprobación(es) fallaron`)
  process.exit(1)
}

console.log('\nTodas las comprobaciones pasaron')

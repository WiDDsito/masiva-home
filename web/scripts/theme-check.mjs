/**
 * Comprobación del botón de tema.
 * Uso: npm run check:theme (requiere el servidor de Vite activo).
 */
import { chromium } from 'playwright-core'

const url = process.env.URL ?? 'http://localhost:5173/'
const browser = await chromium.launch({ channel: 'chrome' })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' })
const page = await context.newPage()

const failures = []
const check = (name, condition) => {
  if (!condition) failures.push(name)
  console.log(`${condition ? 'ok' : 'FALLA'} ${name}`)
}

await page.goto(url, { waitUntil: 'networkidle' })

const initialBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
check('inicia en claro con el sistema en claro', initialBg === 'rgb(245, 243, 239)')

await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click()
await page.waitForTimeout(150)

const darkTheme = await page.evaluate(() => document.documentElement.dataset.theme)
const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
check('el botón activa data-theme="dark"', darkTheme === 'dark')
check('el fondo cambia a carbón', darkBg === 'rgb(25, 24, 23)')

await page.reload({ waitUntil: 'networkidle' })
const persisted = await page.evaluate(() => document.documentElement.dataset.theme)
check('la elección persiste al recargar', persisted === 'dark')

await page.getByRole('button', { name: 'Cambiar a modo claro' }).click()
await page.waitForTimeout(150)
const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
check('vuelve a modo claro', lightBg === 'rgb(245, 243, 239)')

await page.screenshot({ path: '.screenshots/theme-toggle.png' })
await context.close()

// Comprobación de contraste del botón principal en ambos modos.
for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme })
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'networkidle' })
  const cta = p.locator('.hero .btn--primary')
  const colors = await cta.evaluate((el) => {
    const style = getComputedStyle(el)
    return { bg: style.backgroundColor, fg: style.color }
  })
  check(`CTA legible en modo ${scheme}`, colors.bg === 'rgb(177, 138, 80)' && colors.fg === 'rgb(25, 24, 23)')
  await ctx.close()
}

// Sistema en oscuro y elección manual de claro.
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'dark',
  })
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'networkidle' })

  const systemDark = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
  check('sigue al sistema oscuro sin elección previa', systemDark === 'rgb(25, 24, 23)')

  await p.getByRole('button', { name: 'Cambiar a modo claro' }).click()
  await p.waitForTimeout(150)

  const forcedLight = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
  check('el botón fuerza claro sobre un sistema oscuro', forcedLight === 'rgb(245, 243, 239)')

  await ctx.close()
}

await browser.close()

if (failures.length > 0) {
  console.error(`\n${failures.length} comprobación(es) fallaron`)
  process.exit(1)
}

console.log('\nTodas las comprobaciones pasaron')
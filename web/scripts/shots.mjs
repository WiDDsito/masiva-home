/**
 * Capturas de control visual de la home.
 * Uso: npm run shots (requiere Chrome instalado y el servidor de Vite activo).
 * No forma parte del sitio: es herramienta de revisión.
 */
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const url = process.env.URL ?? 'http://localhost:5173/'
const outDir = fileURLToPath(new URL('../.screenshots/', import.meta.url))

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })

const cases = [
  { name: 'desktop-light', width: 1440, height: 900, colorScheme: 'light' },
  { name: 'desktop-dark', width: 1440, height: 900, colorScheme: 'dark' },
  { name: 'mobile-light', width: 390, height: 844, colorScheme: 'light' },
  { name: 'mobile-dark', width: 390, height: 844, colorScheme: 'dark' },
]

for (const testCase of cases) {
  const context = await browser.newContext({
    viewport: { width: testCase.width, height: testCase.height },
    colorScheme: testCase.colorScheme,
    reducedMotion: 'reduce',
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${outDir}${testCase.name}.png`, fullPage: true })
  await context.close()
  console.log(`ok ${testCase.name}`)
}

// Estado con hover y cabecera compactada, para revisar el dorado.
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.locator('.nav__link', { hasText: 'Tienda' }).hover()
  await page.evaluate(() => window.scrollTo(0, 420))
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${outDir}desktop-hover.png` })
  await context.close()
  console.log('ok desktop-hover')
}

await browser.close()

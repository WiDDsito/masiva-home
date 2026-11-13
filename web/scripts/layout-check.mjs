/**
 * Diagnóstico de cambio de layout al alternar el tema.
 * Compara medidas antes y después de cada cambio.
 */
import { chromium } from 'playwright-core'

const url = process.env.URL ?? 'http://localhost:5173/'
const browser = await chromium.launch({ channel: 'chrome' })

async function measure(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('.hero')
    const categories = document.querySelector('.categories')
    return {
      innerWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : null,
      categoriesWidth: categories ? Math.round(categories.getBoundingClientRect().width) : null,
      scrollbarGutter: getComputedStyle(document.documentElement).scrollbarGutter,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
    }
  })
}

for (const viewport of [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobile' },
]) {
  const context = await browser.newContext({ viewport, colorScheme: 'light' })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })

  const light = await measure(page)
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click()
  await page.waitForTimeout(250)
  const dark = await measure(page)

  console.log(`\n== ${viewport.name} ==`)
  let changed = false
  for (const key of Object.keys(light)) {
    const same = JSON.stringify(light[key]) === JSON.stringify(dark[key])
    if (!same && key !== 'colorScheme') changed = true
    console.log(`${same ? 'ok ' : 'CAMBIO'} ${key}: claro=${light[key]}  oscuro=${dark[key]}`)
  }
  if (changed) {
    console.error(`[FALLA] el layout cambió al alternar el tema en ${viewport.name}`)
    process.exitCode = 1
  }

  await context.close()
}

await browser.close()

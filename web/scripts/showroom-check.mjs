import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser = await chromium.launch({channel:'chrome',headless:true})
try {
 const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
 await page.goto(process.env.URL ?? 'http://localhost:5173/',{waitUntil:'networkidle'})
 await page.locator('#showroom').scrollIntoViewIfNeeded()
 await page.locator('.showroom__stage canvas').waitFor()
 await page.waitForTimeout(500)
 const section = await page.locator('#showroom').boundingBox()
 const stage = await page.locator('.showroom__stage').boundingBox()
 assert.ok(stage.width / section.width > .95,'El showroom debe ocupar todo el ancho de la sección')
 await page.getByRole('button',{name:'Centro de mesa',exact:true}).click()
 assert.equal(await page.getByRole('button',{name:'Centro de mesa',exact:true}).getAttribute('aria-pressed'),'true')
 await page.getByRole('button',{name:'Activar giro automático'}).click()
 await page.getByRole('button',{name:'Pausar giro automático'}).click()
 console.log('PASS showroom: ancho completo, selección y giro controlado')
} finally { await browser.close() }

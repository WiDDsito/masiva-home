import { chromium } from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  await page.goto(process.env.URL??'http://127.0.0.1:5177/',{waitUntil:'networkidle'})
  await page.locator('#showroom').scrollIntoViewIfNeeded();await page.locator('canvas').waitFor()
  for(const room of ['Sala','Comedor','Dormitorio']) {
   await page.getByRole('tab',{name:room,exact:true}).click()
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
   await page.waitForTimeout(300)
   await page.locator('#showroom').screenshot({path:`.screenshots/studio-${width}-${room}.png`})
  }
  await page.close()
 }
} finally {await browser.close()}

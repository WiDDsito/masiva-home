import { chromium } from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  await page.goto(process.env.URL??'http://127.0.0.1:5177/',{waitUntil:'networkidle'})
  await page.locator('#showroom').scrollIntoViewIfNeeded();await page.locator('canvas').waitFor()
  await page.getByRole('tab',{name:'Dormitorio',exact:true}).click();await page.waitForTimeout(500)
  await page.locator('#showroom').screenshot({path:`.screenshots/room-${width}.png`})
  if(width===1440){await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#servicios').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);await page.screenshot({path:'.screenshots/services-story.png'})}
  await page.close()
 }
} finally {await browser.close()}

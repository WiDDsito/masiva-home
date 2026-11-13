import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto(process.env.URL??'http://127.0.0.1:5184/',{waitUntil:'domcontentloaded'})
  await page.locator('#showroom').scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
  for(const [room,ids] of [['Sala',['fabela','kevin']],['Comedor',['escanor']],['Dormitorio',['runa']]]) {
   await page.getByRole('tab',{name:room,exact:true}).click()
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
   await page.waitForFunction(ids=>ids.every(id=>document.querySelector(`.showroom-hotspot[data-product-id="${id}"]`)),ids)
   assert.equal(await page.locator('.showroom-hotspot').count(),ids.length)
   for(const id of ids) {
    const marker=page.locator(`.showroom-hotspot[data-product-id="${id}"]`)
    if (width === 1440 && id === 'fabela') { await marker.focus(); await page.keyboard.press('Enter') }
    else await marker.click()
    await page.waitForFunction(id=>document.querySelector(`.showroom-hotspot[data-product-id="${id}"]`)?.getAttribute('aria-pressed')==='true',id)
    await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
    assert.equal(await marker.getAttribute('aria-pressed'),'true')
    assert.ok(await page.locator('.showroom__caption.has-selection').isVisible())
    await page.getByRole('button',{name:'Vista general',exact:true}).click()
    await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
   }
  }
  await page.getByRole('tab',{name:'Sala',exact:true}).click()
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
  await page.locator('#showroom').screenshot({path:`.screenshots/hotspots-${width}.png`})
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  assert.deepEqual(errors,[])
  console.log(`PASS ${width}: indicadores de cuatro productos, selección, cámara y ambientes`)
  await page.close()
 }
}finally{await browser.close()}

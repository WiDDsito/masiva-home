import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
 await page.goto(process.env.URL??'http://127.0.0.1:5180/',{waitUntil:'domcontentloaded'})
 const trigger=page.getByRole('button',{name:'Tienda',exact:true})
 await trigger.hover()
 const box=await trigger.boundingBox()
 await page.mouse.move(box.x+box.width/2,box.y+box.height+5,{steps:12})
 await page.waitForTimeout(500)
 assert.equal(await trigger.getAttribute('aria-expanded'),'true','El menú no debe cerrarse al atravesar el espacio entre Tienda y el panel')
 const link=page.locator('#mega-tienda').getByRole('button',{name:/Aparadores/}).first()
 await link.hover();await page.waitForTimeout(500)
 await link.click()
 await page.waitForURL(/categoria=aparadores/)
 assert.equal(await page.locator('.catalog-card').count(),8)
 assert.equal(await trigger.getAttribute('aria-expanded'),'false')
 console.log('PASS recorrido lento del cursor, selección de Aparadores y cierre tras navegar')
}finally{await browser.close()}

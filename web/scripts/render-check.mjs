import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 const page=await browser.newPage({viewport:{width:Number(process.env.WIDTH??1440),height:1000},reducedMotion:'no-preference'})
 await page.addInitScript(()=>{
   window.draws=0
   for(const prototype of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype]) {
    for(const method of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']) {
     const original=prototype[method]
     if (!original) continue
     prototype[method]=function(...args){window.draws++;return original.apply(this,args)}
    }
   }
 })
 await page.goto(process.env.URL ?? 'http://localhost:5173/',{waitUntil:'networkidle'})
 await page.locator('#showroom').scrollIntoViewIfNeeded()
 await page.locator('canvas').waitFor()
 await page.waitForFunction(() => document.querySelector('canvas')?.dataset.cameraMoving === 'false')
 await page.waitForTimeout(700)
 async function measure(){const before=await page.evaluate(()=>window.draws);await page.waitForTimeout(700);return await page.evaluate(()=>window.draws)-before}
 const idle=await measure()
 await page.getByRole('button',{name:'Activar giro automático'}).click()
 await page.waitForTimeout(700)
 const rotating=await measure()
 await page.evaluate(()=>scrollTo(0,0))
 await page.waitForTimeout(800)
 const offscreen=await measure()
 console.log(JSON.stringify({idle,rotating,offscreen,total:await page.evaluate(()=>window.draws),reduced:await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)}))
 assert.equal(idle,0,'El visor inmóvil no debe dibujar continuamente')
 assert.ok(rotating>0,'El giro debe actualizar el modelo')
 assert.equal(offscreen,0,'El visor fuera de pantalla no debe consumir renderizados')
 console.log(JSON.stringify({idleDraws:idle,rotatingDraws:rotating,offscreenDraws:offscreen}))
} finally {await browser.close()}

import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'})
 await page.addInitScript(()=>{
  window.draws=0
  for(const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype])for(const name of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){
   const original=proto[name];if(original)proto[name]=function(...args){window.draws++;return original.apply(this,args)}
  }
 })
 await page.goto(process.env.URL??'http://127.0.0.1:5174/',{waitUntil:'domcontentloaded'})
 await page.evaluate(()=>document.fonts.ready)
 await page.getByRole('button',{name:'Agregar Aparador Escanor al carrito',exact:true}).click()
 await page.mouse.move(1,1)
 await page.locator('#showroom').scrollIntoViewIfNeeded()
 await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
 await page.waitForTimeout(800)
 const before=await page.evaluate(()=>window.draws)
 await page.waitForTimeout(6500)
 console.log(JSON.stringify({drawsDuringNoticeExpiry:await page.evaluate(()=>window.draws)-before,noticeVisible:await page.locator('.cart-notice').evaluate(el=>el.classList.contains('is-visible')),bag:await page.locator('.cart-count').innerText()}))
}finally{await browser.close()}

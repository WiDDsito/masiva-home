import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const native of [true,false]) {
  const page=await browser.newPage({viewport:{width:native?1440:390,height:1000},reducedMotion:'no-preference'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.addInitScript(native=>{
   window.pageSnapshots=[]
   const start=document.startViewTransition?.bind(document)
   if(!native)document.startViewTransition=undefined
   else if(start)document.startViewTransition=callback=>start(async()=>{
    await callback()
    window.pageSnapshots.push({scroll:scrollY,title:document.querySelector('h1')?.textContent})
   })
  },native)
  await page.goto(process.env.URL??'http://127.0.0.1:5184/',{waitUntil:'domcontentloaded'})
  await page.locator('#showroom').scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
  assert.ok(await page.evaluate(()=>scrollY>500))
  await page.getByRole('link',{name:'Explorar el catálogo',exact:true}).click()
  await page.getByRole('heading',{name:'Catálogo de muebles',exact:true}).waitFor()
  if(native) {
   const snapshots=await page.evaluate(()=>window.pageSnapshots)
   assert.ok(snapshots.some(frame=>frame.title==='Catálogo de muebles'&&frame.scroll===0),'La captura nueva debe estar al inicio del catálogo')
  }else{
   assert.ok(await page.locator('.page-view').evaluate(el=>el.getAnimations().some(animation=>animation.effect.getTiming().duration===280)),'Sin View Transitions debe existir una entrada suave')
  }
  await page.waitForFunction(()=>!document.documentElement.dataset.viewTransition)
  assert.equal(await page.evaluate(()=>scrollY),0)
  assert.deepEqual(errors,[])
  console.log(`PASS transición desde showroom ${native?'nativa':'de respaldo'}: catálogo desde arriba, sin salto de scroll`)
  await page.close()
 }
}finally{await browser.close()}

import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const native of [true,false]) {
  const page=await browser.newPage({viewport:{width:native?1440:390,height:1000},reducedMotion:'no-preference'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.addInitScript(native=>{
   window.pageSnapshots=[]
   window.pageMotion=[]
   const start=document.startViewTransition?.bind(document)
   if(!native)document.startViewTransition=undefined
   else if(start)document.startViewTransition=callback=>{
    const transition=start(async()=>{
     await callback()
     window.pageSnapshots.push({scroll:scrollY,title:document.querySelector('h1')?.textContent,photosReady:Array.from(document.querySelectorAll('.catalog-card img')).slice(0,4).every(img=>img.complete&&img.naturalWidth>0)})
    })
    transition.ready.then(()=>{window.pageMotion=document.getAnimations().map(animation=>({name:animation.animationName,frames:animation.effect?.getKeyframes()}))})
    return transition
   }
  },native)
  await page.goto(process.env.URL??'http://127.0.0.1:5184/',{waitUntil:'domcontentloaded'})
  await page.locator('#showroom').scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
  assert.ok(await page.evaluate(()=>scrollY>500))
  await page.getByRole('link',{name:'Explorar el catálogo',exact:true}).click()
  await page.getByRole('heading',{name:'Catálogo de muebles',exact:true}).waitFor()
  if(native) {
   await page.waitForFunction(()=>window.pageSnapshots.some(frame=>frame.title==='Catálogo de muebles'))
   const snapshots=await page.evaluate(()=>window.pageSnapshots)
   assert.ok(snapshots.some(frame=>frame.title==='Catálogo de muebles'&&frame.scroll===0),'La captura nueva debe estar al inicio del catálogo')
   await page.waitForFunction(()=>window.pageMotion.some(animation=>animation.name==='showroom-catalog-dissolve'))
   const motion=await page.evaluate(()=>window.pageMotion)
   assert.equal(motion.some(animation=>/page-content|^page-in$|^page-out$/.test(animation.name)),false,'El contenido largo no debe desplazarse ni redimensionarse')
   const dissolve=motion.find(animation=>animation.name==='showroom-catalog-dissolve')
   assert.ok(snapshots.some(frame=>frame.photosReady),'Las fotos iniciales deben estar decodificadas antes de capturar')
   assert.ok(dissolve.frames.every(frame=>!frame.transform&&!frame.clipPath),'El fundido usa solo opacidad')
  }else{
   await page.waitForFunction(()=>document.querySelector('.page-view').getAnimations().some(animation=>animation.effect.getTiming().duration>=300))
   assert.ok(await page.locator('.page-view').evaluate(el=>el.getAnimations().some(animation=>animation.effect.getTiming().duration>=300&&animation.effect.getKeyframes().every(frame=>!frame.transform&&!frame.clipPath))),'Sin View Transitions debe existir una entrada suave')
  }
  await page.waitForFunction(()=>!document.documentElement.dataset.viewTransition)
  assert.equal(await page.evaluate(()=>scrollY),0)
  assert.deepEqual(errors,[])
  console.log(`PASS transición desde showroom ${native?'nativa':'de respaldo'}: fundido sin zoom ni deformación y catálogo desde arriba`)
  await page.close()
 }
}finally{await browser.close()}

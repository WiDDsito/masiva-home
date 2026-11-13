import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const width of [1440,390]) for(const section of ['showroom','servicios','contacto']) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.addInitScript(()=>{
   document.addEventListener('click',event=>{if(event.target.closest?.('.mega__all'))window.selectedAt=scrollY},true)
   const start=document.startViewTransition.bind(document)
   document.startViewTransition=(...args)=>{
    window.menuSource={scroll:scrollY,variant:document.documentElement.dataset.pageTransition}
    const transition=start(...args)
    transition.ready.then(()=>{window.menuAnimations=document.getAnimations().map(a=>a.animationName)})
    return transition
   }
  })
  await page.goto(process.env.URL??'http://127.0.0.1:5174/',{waitUntil:'domcontentloaded'})
  await page.evaluate(()=>document.fonts.ready)
  await page.locator(`#${section}`).scrollIntoViewIfNeeded()
  if(section==='showroom')await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.cameraMoving==='false')
  await page.waitForTimeout(350)
  const source=await page.evaluate(()=>scrollY)
  assert.ok(source>500)
  if(width>900){
   await page.getByRole('button',{name:'Tienda',exact:true}).click()
   await page.locator('#mega-tienda .mega__all').click()
  }else{
   await page.getByRole('button',{name:'Abrir menú',exact:true}).click()
   await page.locator('.mobile-shop summary').click()
   await page.locator('#mega-tienda-movil .mega__all').click()
  }
  await page.waitForFunction(()=>window.menuSource)
  const captured=await page.evaluate(()=>window.menuSource)
  const selectedAt=await page.evaluate(()=>window.selectedAt)
  assert.ok(Math.abs(captured.scroll-selectedAt)<3,`La captura debe conservar ${selectedAt}px, obtuvo ${captured.scroll}px`)
  assert.equal(captured.variant,'showroom-catalog','Ver todo el catálogo debe usar el fundido sin desplazamiento')
  await page.waitForFunction(()=>window.menuAnimations?.includes('showroom-catalog-dissolve'))
  assert.ok(!(await page.evaluate(()=>window.menuAnimations)).some(name=>/page-content|^page-in$|^page-out$/.test(name)))
  await page.waitForFunction(()=>!document.documentElement.dataset.viewTransition)
  await page.getByRole('heading',{name:'Catálogo de muebles',exact:true}).waitFor()
  assert.equal(await page.evaluate(()=>scrollY),0)
  assert.equal(await page.locator('.nav__trigger').getAttribute('aria-expanded'),'false')
  assert.deepEqual(errors,[])
  console.log(`PASS ${width} desde ${section}: posición conservada hasta la captura y fundido directo al catálogo`)
  await page.close()
 }
}finally{await browser.close()}

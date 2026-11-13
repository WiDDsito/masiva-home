import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const [width,motion] of [[1440,'no-preference'],[390,'reduce']]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:motion})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.addInitScript(()=>{
   window.transitionMenus=[]
   const native=document.startViewTransition?.bind(document)
   if(native)document.startViewTransition=(...args)=>{
    const el=document.querySelector('#mega-tienda');const css=el&&getComputedStyle(el)
    window.transitionMenus.push({opacity:css?.opacity,visibility:css?.visibility,variant:document.documentElement.dataset.pageTransition})
    return native(...args)
   }
  })
  await page.goto(process.env.URL??'http://127.0.0.1:5182/',{waitUntil:'domcontentloaded'})
  const color=await page.getByRole('link',{name:'Ver tienda',exact:true}).evaluate(el=>getComputedStyle(el).backgroundColor)
  assert.equal(await page.getByRole('link',{name:'Ver catálogo completo',exact:true}).evaluate(el=>getComputedStyle(el).backgroundColor),color)
  const image=page.getByRole('button',{name:'Ver detalles de Aparador Escanor',exact:true})
  await image.click()
  const dialog=page.getByRole('dialog',{name:'Aparador Escanor',exact:true})
  await dialog.waitFor({state:'visible'})
  assert.ok(await dialog.locator('.catalog-preview__gallery').count(),'La ficha de Inicio debe usar la galería moderna')
  assert.ok(await dialog.getByRole('button',{name:/Ver foto/}).count()>1)
  assert.equal(await page.evaluate(()=>window.transitionMenus.length),0,'Abrir la ficha no debe animar toda la página')
  await page.keyboard.press('Escape')
  await dialog.waitFor({state:'detached'})
  assert.ok(await image.evaluate(el=>el===document.activeElement))
  await page.getByRole('banner').getByRole('link',{name:'Masiva Home, ir al inicio'}).click()
  if(width>900){
   await page.getByRole('button',{name:'Tienda',exact:true}).click()
   await page.locator('#mega-tienda .mega__all').click()
  }else{
   await page.getByRole('button',{name:'Abrir menú',exact:true}).click()
   await page.locator('.mobile-shop summary').click()
   await page.locator('#mega-tienda-movil .mega__all').click()
  }
  await page.getByRole('heading',{name:'Catálogo de muebles',exact:true}).waitFor()
  await page.waitForFunction(()=>!document.documentElement.dataset.viewTransition)
  assert.equal(await page.locator('.mobile-nav').count(),0)
  assert.equal(await page.locator('.nav__trigger').getAttribute('aria-expanded'),'false')
  if(width>900){
   const snapshots=await page.evaluate(()=>window.transitionMenus)
   assert.ok(snapshots.length>0)
   assert.ok(snapshots.every(menu=>menu.opacity==='0'&&menu.visibility==='hidden'),'La transición debe capturar la cabecera con el menú ya oculto')
   assert.ok(snapshots.every(menu=>menu.variant==='page'),'El menú Tienda conserva su transición anterior')
  }
  await page.reload({waitUntil:'domcontentloaded'})
  await page.getByRole('heading',{name:'Catálogo de muebles',exact:true}).waitFor()
  assert.equal(await page.locator('.nav__trigger').getAttribute('aria-expanded'),'false')
  assert.deepEqual(errors,[])
  console.log(`PASS ${width}: CTA uniforme, galería moderna, foco y transición sin menú residual`)
  await page.close()
 }
}finally{await browser.close()}

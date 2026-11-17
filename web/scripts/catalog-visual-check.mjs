import assert from 'node:assert/strict'
import {chromium} from 'playwright-core'
const browser=await chromium.launch({channel:'chrome',headless:true})
try {
 for(const width of [320,390,768,1024,1440]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'})
  const issues=[];const photos=[]
  page.on('pageerror',e=>issues.push(e.message))
  page.on('response',r=>{if(r.status()>=400)issues.push(`${r.status()} ${r.url()}`)})
  page.on('request',r=>{if(r.resourceType()==='image')photos.push(r.url())})
  await page.goto(`${process.env.URL??'http://127.0.0.1:5178/'}#catalogo`,{waitUntil:'networkidle'})
  await page.screenshot({path:`.screenshots/catalog-initial-${width}.png`})
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  assert.equal(photos.some(url=>/cajones|medidas/.test(url)),false,'Gallery details must not load on catalogue entry')
  await page.getByRole('button',{name:'Todas las categorías',exact:true}).click()
  await page.screenshot({path:`.screenshots/catalog-menu-${width}.png`})
  await page.keyboard.press('Escape')
  await page.getByRole('navigation',{name:'Categorías del catálogo'}).getByRole('button',{name:'Aparadores',exact:true}).click()
  await page.getByRole('button',{name:'Vista rápida de Aparador Arden'}).click()
  const dialog=page.getByRole('dialog')
  await dialog.getByRole('button',{name:'Plomo y duna',exact:true}).click()
  await dialog.locator('.catalog-preview__image').evaluate(img=>img.decode())
  await dialog.evaluate(el=>el.scrollTo(0,0))
  await page.screenshot({path:`.screenshots/catalog-gallery-${width}.png`})
  assert.ok(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth))
  await page.keyboard.press('Escape')
  for(const name of ['Aira','Arden','Arian','Ars','Bruyne','Escanor','Capra','Cedric']) {
   await page.getByRole('button',{name:`Vista rápida de Aparador ${name}`}).click()
   const image=page.locator('.catalog-preview__image')
   await image.evaluate(img=>img.decode())
   assert.ok(await image.evaluate(img=>img.naturalWidth>0))
   assert.ok(await page.locator('.catalog-preview__thumbnails button').count()>=5)
   if(name==='Capra'||name==='Cedric') {
    assert.equal(await page.locator('.catalog-preview__thumbnails button').count(),6)
    assert.match(await dialog.innerText(),/Precio por confirmar/)
    assert.ok((await dialog.innerText()).includes(name==='Capra'?'120 × 85 × 45 cm':'180 × 80 × 40 cm'))
    assert.equal(await dialog.getByRole('button',{name:/Agregar .* al carrito/}).count(),0)
    await dialog.getByRole('button',{name:/Ver foto .*Medidas/}).click()
    await image.evaluate(img=>img.decode())
    assert.match(await image.getAttribute('src'),/medidas/)
    assert.ok(await dialog.getByRole('link',{name:'Consultar precio',exact:true}).isVisible())
   }
   await page.keyboard.press('Escape')
  }
  await page.getByRole('button',{name:'Limpiar filtros'}).click()
  await page.getByLabel('Ordenar productos').selectOption('price-desc')
  assert.match(await page.locator('.catalog-card').first().innerText(),/Runa/)
  await page.getByLabel('Ordenar productos').selectOption('price-asc')
  assert.match(await page.locator('.catalog-card').first().innerText(),/Gina/)
  await page.evaluate(()=>document.documentElement.dataset.theme='dark')
  await page.screenshot({path:`.screenshots/catalog-dark-${width}.png`})
  assert.deepEqual(issues,[])
  console.log(`PASS ${width}: menú, galería de ocho modelos, Capra/Cedric con medidas, orden por precio, carga diferida y sin desbordamiento`)
  await page.close()
 }
}finally{await browser.close()}

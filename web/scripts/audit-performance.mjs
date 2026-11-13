import {chromium} from 'playwright-core'
import {writeFileSync,readFileSync,readdirSync,statSync,mkdirSync} from 'node:fs'
import {gzipSync} from 'node:zlib'
import {dirname} from 'node:path'
const browser=await chromium.launch({channel:'chrome',headless:true})
const results=[]
try {
 for(const motion of ['reduce','no-preference']) {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:motion})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  const cd=await page.context().newCDPSession(page);await cd.send('Network.enable')
  let videoBytes=0;const videos=new Set()
  cd.on('Network.responseReceived',e=>{if(/modern-template.*mp4/.test(e.response.url))videos.add(e.requestId)})
  cd.on('Network.dataReceived',e=>{if(videos.has(e.requestId))videoBytes+=e.encodedDataLength})
  await page.goto(process.env.URL??'http://127.0.0.1:5174/',{waitUntil:'domcontentloaded'})
  await page.waitForTimeout(2200)
  results.push({motion,videoBytes,videoSource:await page.locator('video').getAttribute('src'),showroomDownloaded:await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('Showroom3D'))),errors})
  await page.close()
 }
}finally{await browser.close()}
const assets=readdirSync('dist/assets').filter(x=>/^index-.*\.js$/.test(x));
const output={browsers:results,mainJs:assets.map(name=>({name,bytes:statSync(`dist/assets/${name}`).size,gzip:gzipSync(readFileSync(`dist/assets/${name}`)).length})),videoBytes:statSync('assets/videos/modern-template.mp4').size}
const target=process.env.OUT??'.screenshots/audit-performance.json'
mkdirSync(dirname(target),{recursive:true})
writeFileSync(target,JSON.stringify(output,null,2));console.log(JSON.stringify(output))

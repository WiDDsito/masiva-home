import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const source = readFileSync(new URL('../src/lib/cart.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText
const { updateCart, restoreCart, cartReducer } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
assert.deepEqual(updateCart([], 'escanor', 1), [{id:'escanor',quantity:1}])
assert.deepEqual(updateCart([{id:'escanor',quantity:1}], 'escanor', 2), [{id:'escanor',quantity:2}])
assert.deepEqual(updateCart([{id:'escanor',quantity:2}], 'escanor', 0), [])
assert.equal(updateCart([], 'escanor', 200)[0].quantity,99)
assert.deepEqual(restoreCart('{broken', ['escanor']), [])
assert.deepEqual(restoreCart('{"id":1}', ['escanor']), [])
assert.deepEqual(restoreCart('[{"id":"unknown","quantity":1},{"id":"escanor","quantity":-5}]', ['escanor']), [])
assert.deepEqual(restoreCart('[{"id":"escanor","quantity":2},{"id":"escanor","quantity":4}]', ['escanor']), [{id:'escanor',quantity:4}])
console.log('PASS carrito: agregar, actualizar, eliminar, límites y datos corruptos')

assert.equal(typeof cartReducer,'function')
const empty={lines:[],feedback:null,revision:0}
const product={id:'escanor',name:'Aparador Escanor'}
const once=cartReducer(empty,{type:'add',product})
const twice=cartReducer(once,{type:'add',product})
assert.equal(twice.lines[0].quantity,2)
assert.notEqual(once.feedback.id,twice.feedback.id)
assert.equal(cartReducer(twice,{type:'dismiss',id:once.feedback.id}).feedback.id,twice.feedback.id)
assert.equal(cartReducer(twice,{type:'dismiss',id:twice.feedback.id}).feedback,null)
const limit=cartReducer({...empty,lines:[{id:'escanor',quantity:99}]},{type:'add',product})
assert.equal(limit.lines[0].quantity,99)
assert.equal(limit.feedback.kind,'limit')
assert.ok(!limit.feedback.message.includes('agregado'))
assert.deepEqual(cartReducer(twice,{type:'quantity',id:'escanor',quantity:0}).lines,[])
console.log('PASS avisos: límite honesto, eventos repetidos y descarte sin borrar avisos nuevos')

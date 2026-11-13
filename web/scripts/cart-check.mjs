import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const source = readFileSync(new URL('../src/lib/cart.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText
const { updateCart, restoreCart } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
assert.deepEqual(updateCart([], 'escanor', 1), [{id:'escanor',quantity:1}])
assert.deepEqual(updateCart([{id:'escanor',quantity:1}], 'escanor', 2), [{id:'escanor',quantity:2}])
assert.deepEqual(updateCart([{id:'escanor',quantity:2}], 'escanor', 0), [])
assert.equal(updateCart([], 'escanor', 200)[0].quantity,99)
assert.deepEqual(restoreCart('{broken', ['escanor']), [])
assert.deepEqual(restoreCart('{"id":1}', ['escanor']), [])
assert.deepEqual(restoreCart('[{"id":"unknown","quantity":1},{"id":"escanor","quantity":-5}]', ['escanor']), [])
assert.deepEqual(restoreCart('[{"id":"escanor","quantity":2},{"id":"escanor","quantity":4}]', ['escanor']), [{id:'escanor',quantity:4}])
console.log('PASS carrito: agregar, actualizar, eliminar, límites y datos corruptos')

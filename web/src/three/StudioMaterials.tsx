import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

let wood: CanvasTexture | undefined
let textile: CanvasTexture | undefined
let contact: CanvasTexture | undefined
function grainTexture(fabric = false) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  let seed = 6183
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  ctx.fillStyle = fabric ? '#d9d6d0' : '#d7c3a3'; ctx.fillRect(0, 0, 512, 512)
  for (let y = 0; y < 512; y++) {
    const shade = Math.floor(65 + random() * 65)
    ctx.strokeStyle = `rgba(${shade},${shade - 15},${shade - 30},${fabric ? .08 : .08 + random() * .2})`
    ctx.lineWidth = fabric ? .5 : .4 + random()
    ctx.beginPath()
    for (let x = 0; x <= 512; x += 16) {
      const offset = fabric ? Math.sin(x * .6) * .4 : Math.sin(x * .013 + y * .025) * 3 + Math.sin(x * .031 + y) * .6
      if (x === 0) ctx.moveTo(x, y + offset); else ctx.lineTo(x, y + offset)
    }
    ctx.stroke()
    if (fabric && y % 2 === 0) { ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.moveTo(y, 0); ctx.lineTo(y, 512); ctx.stroke() }
  }
  const texture = new CanvasTexture(canvas); texture.wrapS = texture.wrapT = RepeatWrapping; texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4
  return texture
}
export function Wood({ color = '#c5a47b' }: { color?: string }) {
  wood ??= grainTexture()
  return <meshStandardMaterial color={color} map={wood} roughness={.53} bumpMap={wood} bumpScale={.002} envMapIntensity={.55} />
}
export function Fabric({ color = '#d5cbbd' }: { color?: string }) {
  textile ??= grainTexture(true)
  return <meshStandardMaterial color={color} map={textile} roughness={.95} bumpMap={textile} bumpScale={.003} />
}
export function Contact({ at, size }: { at: [number, number, number]; size: [number, number] }) {
  if (!contact) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')!; const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(25,20,15,.24)'); gradient.addColorStop(.6, 'rgba(25,20,15,.1)'); gradient.addColorStop(1, 'rgba(25,20,15,0)')
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128); contact = new CanvasTexture(canvas)
  }
  return <mesh position={at} rotation-x={-Math.PI / 2}><planeGeometry args={size} /><meshBasicMaterial map={contact} transparent depthWrite={false} /></mesh>
}

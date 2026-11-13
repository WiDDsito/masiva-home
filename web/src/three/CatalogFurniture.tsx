import { useMemo } from 'react'
import { ExtrudeGeometry, Shape } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { Wood } from './StudioMaterials'

export type Finish = 'wood' | 'darkWood' | 'ivory' | 'black' | 'gray' | 'metal'
export function Panel({ at, size, finish = 'wood', turn = 0 }: { at: [number, number, number]; size: [number, number, number]; finish?: Finish; turn?: number }) {
  return <mesh position={at} rotation-y={turn} castShadow receiveShadow>
    <boxGeometry args={size} />
    {finish === 'wood' || finish === 'darkWood' ? <Wood color={finish === 'wood' ? '#d1b58e' : '#a98762'} /> : <meshStandardMaterial color={{ivory:'#f0ede5',black:'#292925',gray:'#626461',metal:'#b7b8ae'}[finish]} roughness={finish === 'metal' ? .26 : .48} metalness={finish === 'metal' ? .75 : .03} envMapIntensity={.65} />}
  </mesh>
}
function Handle({ x, y, z, length = .11, vertical = false, finish = 'black' }: { x: number; y: number; z: number; length?: number; vertical?: boolean; finish?: Finish }) {
  return <Panel at={[x,y,z]} size={vertical ? [.012,length,.018] : [length,.012,.018]} finish={finish} />
}
export interface FurnitureProps { position: [number, number, number]; onSelect: (name: string) => void }
function select(event: ThreeEvent<MouseEvent>, onSelect: FurnitureProps['onSelect'], name: string) { event.stopPropagation(); onSelect(name) }

/** Fabela: 110 × 40 × 60 cm; black top, open storage, right drawer and four black feet. */
export function Fabela({ position, onSelect }: FurnitureProps) {
  return <group position={position} onClick={event => select(event,onSelect,'Centro de mesa')}>
    <Panel at={[0,.388,0]} size={[1.1,.025,.6]} finish="black" />
    <Panel at={[0,.132,0]} size={[1.1,.025,.58]} finish="darkWood" />
    <Panel at={[-.54,.26,0]} size={[.02,.25,.58]} finish="darkWood" />
    <Panel at={[.54,.26,0]} size={[.02,.25,.58]} finish="darkWood" />
    <Panel at={[0,.26,-.28]} size={[1.06,.25,.02]} finish="darkWood" />
    <Panel at={[.25,.26,0]} size={[.018,.25,.56]} finish="darkWood" />
    <Panel at={[.395,.27,.278]} size={[.265,.18,.022]} finish="darkWood" />
    <Handle x={.395} y={.28} z={.3} />
    {[-.47,.47].flatMap(x=>[-.23,.23].map(z=><group key={`${x}-${z}`} rotation-z={x<0?.1:-.1}><Panel at={[x,.06,z]} size={[.045,.12,.045]} finish="black" /></group>))}
    <Panel at={[-.16,.16,.015]} size={[.31,.025,.2]} finish="black" />
    <Panel at={[-.16,.183,.015]} size={[.29,.015,.19]} finish="ivory" />
  </group>
}
/** Kevin: 200 × 50 × 40 cm; gray doors and drawers, upper open compartments. */
export function Kevin({ position, onSelect }: FurnitureProps) {
  return <group position={position} onClick={event => select(event,onSelect,'Mesa de TV')}>
    <Panel at={[0,.49,0]} size={[2,.02,.4]} />
    <Panel at={[0,.11,0]} size={[2,.025,.4]} />
    <Panel at={[0,.3,-.19]} size={[2,.36,.018]} />
    {[-.99,.99].map(x=><Panel key={x} at={[x,.3,0]} size={[.02,.36,.4]} />)}
    {[-.74,.74].map(x=><Panel key={x} at={[x,.3,.198]} size={[.49,.35,.022]} finish="gray" />)}
    {[-.49,0,.49].map(x=><Panel key={x} at={[x,.3,0]} size={[.016,.36,.38]} />)}
    <Panel at={[0,.295,.01]} size={[.98,.016,.36]} />
    {[-.245,.245].map(x=><Panel key={x} at={[x,.205,.198]} size={[.47,.16,.022]} finish="gray" />)}
    {[-.86,.86].flatMap(x=>[-.13,.13].map(z=><Panel key={`${x}-${z}`} at={[x,.05,z]} size={[.035,.1,.035]} finish="metal" />))}
  </group>
}
function CutPanel({ points, finish }: { points: [number,number][]; finish: 'wood' | 'ivory' }) {
  const geometry = useMemo(() => {
    const shape = new Shape(); points.forEach(([x,y],i)=>i===0?shape.moveTo(x,y):shape.lineTo(x,y)); shape.closePath()
    return new ExtrudeGeometry(shape,{depth:.35,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:1,steps:1})
  },[points])
  return <mesh geometry={geometry} position-z={-.175} castShadow receiveShadow>{finish==='wood'?<Wood color="#fbf4db" />:<meshStandardMaterial color="#eeeae2" roughness={.38} envMapIntensity={.5} />}</mesh>
}
const escanorUpper: [number,number][] = [[-.65,.38],[-.23,.38],[.04,.63],[.65,.63],[.65,1],[-.65,1]]
const escanorLower: [number,number][] = [[-.65,0],[.65,0],[.65,.5],[.04,.5],[-.23,.25],[-.65,.25]]
/** Escanor: 130 × 100 × 35 cm; stepped white base and diagonal wood volume. */
export function Escanor({ position, onSelect }: FurnitureProps) {
  return <group position={position} onClick={event=>select(event,onSelect,'Aparador Escanor')}>
    <CutPanel points={escanorUpper} finish="wood" /><CutPanel points={escanorLower} finish="ivory" />
    {[-.48,-.3].map(x=><Panel key={x} at={[x,.315,0]} size={[.012,.13,.19]} finish="ivory" />)}
    <Panel at={[-.215,.705,.178]} size={[.0015,.58,.001]} finish="darkWood" />
    <Panel at={[.215,.82,.178]} size={[.0015,.35,.001]} finish="darkWood" />
    <Panel at={[-.215,.12,.178]} size={[.0015,.23,.001]} finish="gray" />
    <Panel at={[.215,.245,.178]} size={[.0015,.48,.001]} finish="gray" />
  </group>
}
/** Runa: 230 × 220 × 50 cm; six fronts, central wood slats and long side handles. */
export function Runa({ position, onSelect }: FurnitureProps) {
  return <group position={position} onClick={event=>select(event,onSelect,'Ropero')}>
    <Panel at={[0,1.1,-.24]} size={[2.3,2.2,.02]} finish="darkWood" />
    {[-1.135,1.135].map(x=><Panel key={x} at={[x,1.1,0]} size={[.03,2.2,.5]} finish="darkWood" />)}
    {[.025,2.175].map(y=><Panel key={y} at={[0,y,0]} size={[2.3,.05,.5]} finish="darkWood" />)}
    {[-.94,-.565,.565,.94].map(x=><Panel key={x} at={[x,1.1,.248]} size={[.37,2.08,.025]} finish="ivory" />)}
    <Panel at={[0,1.1,.242]} size={[.745,2.08,.03]} finish="darkWood" />
    {Array.from({length:36},(_,i)=><Panel key={i} at={[-.362+i*.0207,1.1,.265]} size={[.011,2.08,.012]} finish="darkWood" />)}
    {[-.755,.755].map(x=><Handle key={x} x={x} y={.9} z={.283} length={.8} vertical finish="darkWood" />)}
    {[-.04,.04].map(x=><Handle key={x} x={x} y={1.05} z={.286} length={.025} finish="metal" />)}
  </group>
}

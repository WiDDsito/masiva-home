import { RoundedBox } from '@react-three/drei'
import type { ReactNode } from 'react'
import type { ShowroomProps } from './Showroom3D'
import type { RoomId } from '../content/showroom'
import { Alferez, DiningIrene, Escanor, Fabela, Kevin, Panel, Runa } from './CatalogFurniture'
import { Fabric, Contact, Wood } from './StudioMaterials'

function Cushion({ at, size, color = '#d7cdbf' }: { at:[number,number,number]; size:[number,number,number]; color?:string }) {
  return <RoundedBox args={size} position={at} radius={.065} smoothness={3} castShadow receiveShadow><Fabric color={color} /></RoundedBox>
}
function Vase({ at, color = '#ece7dc', scale = 1 }: {at:[number,number,number];color?:string;scale?:number}) {
  return <group position={at} scale={scale}>
    <mesh position-y={.085} castShadow><cylinderGeometry args={[.04,.065,.17,20]} /><meshStandardMaterial color={color} roughness={.5} /></mesh>
    <mesh position-y={.2} castShadow><cylinderGeometry args={[.023,.04,.08,20]} /><meshStandardMaterial color={color} roughness={.5} /></mesh>
  </group>
}
function Plant({ at, scale = 1 }: { at:[number,number,number];scale?:number }) {
  return <group position={at} scale={scale}>
    <mesh position-y={.12} castShadow><cylinderGeometry args={[.1,.075,.24,20]} /><meshStandardMaterial color="#e4ded2" roughness={.8} /></mesh>
    {Array.from({length:7},(_,i)=><group key={i} rotation-y={i*.9}>
      <mesh position={[.055,.35,.02]} rotation-z={-.35}><cylinderGeometry args={[.003,.004,.35,5]} /><meshStandardMaterial color="#5f6544" /></mesh>
      <mesh position={[.1,.48,.02]} scale={[.1,.2,.025]} rotation-z={-.45}><sphereGeometry args={[1,10,8]} /><meshStandardMaterial color={i%2?'#666e4b':'#7d8359'} roughness={.85} /></mesh>
    </group>)}
  </group>
}
function Chair({ x, z, turn = 0 }: {x:number;z:number;turn?:number}) {
  return <group position={[x,0,z]} rotation-y={turn}>
    <Cushion at={[0,.46,0]} size={[.45,.09,.43]} />
    <Cushion at={[0,.72,-.18]} size={[.45,.47,.08]} color="#c6b69e" />
    {[-.17,.17].flatMap(x=>[-.16,.16].map(z=><Panel key={`${x}-${z}`} at={[x,.23,z]} size={[.035,.46,.035]} finish="darkWood" />))}
  </group>
}
function Architecture({ room }: {room:RoomId}) {
  return <>
    <Panel at={[0,-.045,0]} size={[5.2,.08,4]} />
    {Array.from({length:20},(_,i)=><group key={i}>
      <mesh position={[-2.47+i*.26,.0005,0]} rotation-x={-Math.PI/2} receiveShadow><planeGeometry args={[.257,4]} /><Wood color={i%3===0?'#e4d5b9':'#e9dcc3'} /></mesh>
      <Panel at={[-2.47+i*.26,.001,(i%3-1)*1.1]} size={[.26,.001,.004]} finish="darkWood" />
    </group>)}
    <mesh position={[0,1.4,-2.045]} receiveShadow><boxGeometry args={[5.3,2.8,.09]} /><meshStandardMaterial color={room==='dormitorio'?'#e0dfd8':'#e5e0d5'} roughness={.95} /></mesh>
    <mesh position={[-2.64,1.4,0]} receiveShadow><boxGeometry args={[.08,2.8,4.1]} /><meshStandardMaterial color="#e8e4da" roughness={.95} /></mesh>
    <Panel at={[0,.045,-1.99]} size={[5.2,.09,.025]} finish="ivory" />
    <Panel at={[-2.59,.045,0]} size={[.025,.09,4]} finish="ivory" />
    <mesh position={[-2.591,1.65,-.3]} rotation-y={Math.PI/2}><planeGeometry args={[1.5,1.65]} /><meshBasicMaterial color="#f6f3e7" /></mesh>
    {[-1.03,.43].map(z=><Panel key={z} at={[-2.57,1.65,z]} size={[.045,1.72,.035]} finish="ivory" />)}
    {[.83,2.47].map(y=><Panel key={y} at={[-2.57,y,-.3]} size={[.045,.035,1.5]} finish="ivory" />)}
    <Panel at={[-2.55,1.65,-.3]} size={[.045,1.65,.025]} finish="ivory" />
    {[-1.2,.6].flatMap(edge=>Array.from({length:7},(_,i)=><mesh key={`${edge}-${i}`} position={[-2.45,1.3,edge+i*.055]} castShadow><cylinderGeometry args={[.045,.055,2.6,12]} /><Fabric color="#e8e2d7" /></mesh>))}
    <group position={[-.6,1.8,-1.98]}><Panel at={[0,0,0]} size={[1.15,.75,.025]} finish="darkWood" /><mesh position-z={.018}><planeGeometry args={[1.08,.68]} /><meshStandardMaterial color="#ded9cf" roughness={1} /></mesh><mesh position={[-.18,0,.025]}><circleGeometry args={[.21,32]} /><meshStandardMaterial color="#a59176" roughness={1} /></mesh><mesh position={[.22,-.1,.025]}><planeGeometry args={[.26,.35]} /><meshStandardMaterial color="#6b7774" roughness={1} /></mesh></group>
  </>
}
type ProductSelectHandler = ShowroomProps['onSelect']

function SelectableProduct({ id, onSelect, children }: { id: string; onSelect?: ProductSelectHandler; children: ReactNode }) {
  if (!onSelect) return <>{children}</>

  return <group onClick={event => {
    event.stopPropagation()
    if (event.button === 0 && event.delta <= 4) onSelect(id)
  }}>
    {children}
  </group>
}

export function RoomContents({ room, onProductSelect }: { room: RoomId; onProductSelect?: ProductSelectHandler }) {
  return <>
    <Architecture room={room} />
    {room==='sala' && <>
      <group position={[-1.55,0,-.2]} rotation-y={Math.PI/2}>
        <Panel at={[0,.15,0]} size={[2.25,.14,.83]} finish="darkWood" />
        <Cushion at={[0,.43,0]} size={[2.2,.43,.85]} />
        {[-.68,0,.68].map(x=><Cushion key={x} at={[x,.72,-.31]} size={[.68,.65,.2]} />)}
        {[-1.04,1.04].map(x=><Cushion key={x} at={[x,.58,0]} size={[.18,.5,.9]} />)}
        {[-.9,.9].flatMap(x=>[-.3,.3].map(z=><Panel key={`${x}-${z}`} at={[x,.065,z]} size={[.045,.13,.045]} finish="darkWood" />))}
      </group>
      <mesh position={[0,.003,.1]} rotation-x={-Math.PI/2} receiveShadow><planeGeometry args={[3.1,2.7]} /><Fabric color="#c2b9a9" /></mesh>
      <Contact at={[-.3,.008,.3]} size={[1.5,.95]} />
      <SelectableProduct id="fabela" onSelect={onProductSelect}>
        <Fabela position={[-.3,0,.3]} />
      </SelectableProduct>
      <group position={[.9,0,-1.7]}>
        <SelectableProduct id="kevin" onSelect={onProductSelect}>
          <Kevin position={[0,0,0]} />
        </SelectableProduct>
        
        <Panel at={[0,1.18,-.19]} size={[1.45,.8,.045]} finish="black" />
        <Vase at={[.74,.51,0]} /><Plant at={[-.76,.51,0]} scale={.5} />
      </group>
      <Vase at={[-.35,.403,.25]} scale={.55} color="#6c7168" /><Plant at={[-1.8,0,-1.6]} scale={1.4} />
    </>}
    {room==='comedor' && <>
      <SelectableProduct id="escanor" onSelect={onProductSelect}>
        <Escanor position={[-.7,0,-1.7]} />
      </SelectableProduct>
      <Contact at={[-.7,.006,-1.7]} size={[1.6,.6]} />
      <Vase at={[-.28,1.005,-1.65]} scale={.8} /><Plant at={[-1.15,1.005,-1.65]} scale={.45} />
      <group position={[.4, 0, .4]}>
        <SelectableProduct id="irene-comedor" onSelect={onProductSelect}>
          <DiningIrene position={[0, 0, 0]} />
        </SelectableProduct>
        {[-.5, .5].map(x => <group key={x}>
          <Chair x={x} z={-.75} />
          <Chair x={x} z={.75} turn={Math.PI} />
        </group>)}
        <Vase at={[-.35, .75, -.1]} scale={.75} color="#c1b29a" />
      </group>
    </>}
    {room==='dormitorio' && <>
      <group position={[-1,0,.2]}>
        <SelectableProduct id="alferez" onSelect={onProductSelect}>
          <Alferez position={[0, 0, 0]} />
          <Cushion at={[0, .365, .02]} size={[1.51, .22, 1.86]} color="#ebe5da" />
          <Cushion at={[0, .48, .39]} size={[1.52, .055, 1.08]} color="#666b64" />
          {[-.35, .35].map(x => <Cushion key={x} at={[x, .52, -.55]} size={[.58, .12, .39]} color="#ede8dd" />)}
        </SelectableProduct>
      </group>
      <Contact at={[.75,.006,-1.65]} size={[2.6,.85]} />
      <SelectableProduct id="runa" onSelect={onProductSelect}>
        <Runa position={[.75,0,-1.65]} />
      </SelectableProduct>
      <Panel at={[-2,.31,-.65]} size={[.4,.6,.4]} finish="darkWood" /><Vase at={[-2,.62,-.65]} scale={.7} />
      <Plant at={[2.15,0,.9]} scale={1.3} />
    </>}
  </>
}

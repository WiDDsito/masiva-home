import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three'
import type { RoomId } from '../content/showroom'
import { useReducedMotion } from 'motion/react'
import { Canvas } from '@react-three/fiber'
import { ShowroomScene } from './ShowroomScene'

export interface ShowroomProps {
  room: RoomId
  active: string | null
  onSelect: (productId: string) => void
  pan: boolean
  running: boolean
  rotate: boolean
  reset: number
  zoom: number
  onUnavailable: () => void
}

export default function Showroom3D(props: ShowroomProps) {
  const reduced = useReducedMotion()
  return (
    <Canvas camera={{ position: [5.2, 3.8, 6.8], fov: 38 }} dpr={[1, 1.5]}
      frameloop={!props.running ? 'never' : props.rotate && !reduced ? 'always' : 'demand'}
      onCreated={({gl})=>{gl.shadowMap.type=PCFSoftShadowMap;gl.toneMapping=ACESFilmicToneMapping;gl.toneMappingExposure=1.1;gl.domElement.addEventListener('webglcontextlost', props.onUnavailable, { once: true })}}
      gl={{ alpha: true, antialias: true }} shadows fallback={<p className="showroom__loading">Puedes explorar las fotografías y medidas en el catálogo.</p>}>
      <ShowroomScene {...props} />
    </Canvas>
  )
}

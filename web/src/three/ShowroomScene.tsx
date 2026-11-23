import { showroomCamera } from '../lib/showroomCamera'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { Color, Vector3 } from 'three'
import type { DirectionalLight, Group } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { rooms } from '../content/showroom'
import type { RoomId } from '../content/showroom'
import { RoomContents } from './RoomContents'
import { ShowroomHotspots } from './ShowroomHotspots'
import type { ShowroomProps } from './Showroom3D'

function MorphingRoom({ room, active, onSelect, zoom }: Pick<ShowroomProps, 'room' | 'active' | 'onSelect' | 'zoom'>) {
  const group = useRef<Group>(null)
  const [displayed, setDisplayed] = useState<RoomId>(room)
  const progress = useRef(1)
  const scale = useRef(zoom)
  const invalidate = useThree(state => state.invalidate)
  const reduced = useReducedMotion()
  useEffect(() => { invalidate() }, [room, zoom, reduced, invalidate])
  useFrame((_, rawDelta) => {
    if (reduced) {
      if (displayed !== room) { setDisplayed(room); invalidate() }
      progress.current = 1
      scale.current = zoom
      if (group.current) { group.current.scale.setScalar(zoom); group.current.position.y = 0; group.current.rotation.y = 0 }
      return
    }
    const delta = Math.min(rawDelta, .05)
    const leaving = displayed !== room
    const target = leaving ? 0 : 1
    progress.current = reduced ? target : progress.current + (target - progress.current) * Math.min(delta * 11, 1)
    scale.current = reduced ? zoom : scale.current + (zoom - scale.current) * Math.min(delta * 12, 1)
    if (leaving && progress.current < .015) { setDisplayed(room); progress.current = 0 }
    if (group.current) {
      group.current.scale.setScalar(Math.max(.001, (.88 + .12 * progress.current) * scale.current))
      group.current.position.y = (1 - progress.current) * -1.8
      group.current.rotation.y = (1 - progress.current) * -.18
    }
    if (Math.abs(progress.current - 1) > .001 || leaving || Math.abs(scale.current - zoom) > .001) invalidate()
  })
  return <group ref={group}><RoomContents room={displayed} />{displayed === room && <ShowroomHotspots room={displayed} active={active} onSelect={onSelect} />}</group>
}

export function ShowroomScene({ room, active, onSelect, running, rotate, reset, zoom, pan }: ShowroomProps) {
  const reduced = useReducedMotion()
  const controls = useRef<OrbitControlsImpl>(null)
  const light = useRef<DirectionalLight>(null)
  const { camera, invalidate, scene, size, gl } = useThree()
  const travelling = useRef(true)
  const target = useRef(new Vector3())
  const lookAt = useRef(new Vector3(0, .5, 0))
  const background = useRef(new Color(rooms[room].background))
  useEffect(() => {
    const pose = showroomCamera(room, active, size.width / size.height, zoom)
    target.current.fromArray(pose.position)
    lookAt.current.fromArray(pose.target)
    background.current.set(rooms[room].background)
    travelling.current = true
    gl.domElement.dataset.cameraMoving = 'true'
    invalidate()
  }, [room, active, reset, zoom, size.width, size.height, invalidate, gl])
  useFrame((_, rawDelta) => {
    if (!travelling.current) return
    const amount = reduced ? 1 : 1 - Math.exp(-Math.min(rawDelta, .05) * 7)
    camera.position.lerp(target.current, amount)
    if (scene.background instanceof Color) scene.background.lerp(background.current, amount)
    if (light.current) light.current.intensity += ((room === 'dormitorio' ? .75 : .9) - light.current.intensity) * amount
    if (controls.current) controls.current.target.lerp(lookAt.current, amount)
    if (camera.position.distanceTo(target.current) < .003 && (!controls.current || controls.current.target.distanceTo(lookAt.current) < .003)) {
      travelling.current = false
      gl.domElement.dataset.cameraMoving = 'false'
      gl.domElement.dataset.cameraDistance = camera.position.distanceTo(controls.current?.target ?? lookAt.current).toFixed(4)
    }
    else invalidate()
  })
  return <>
    <color attach="background" args={['#d5d0c7']} />
    <Environment resolution={64} frames={1}><Lightformer form="rect" intensity={1.8} color="#fff6e6" position={[-4,3,0]} scale={[3,4]} target={[0,1,0]} /><Lightformer form="rect" intensity={.6} position={[3,4,4]} scale={[4,4]} target={[0,0,0]} /></Environment>
    <ambientLight intensity={.6} />
    <hemisphereLight args={['#fff4df','#b7a58b',.75]} />
    <directionalLight ref={light} position={[-3, 5, 2]} intensity={.9} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-normalBias={.02} shadow-radius={3} shadow-bias={-.0002} />
    <directionalLight position={[-4, 3, -2]} intensity={.6} />
    <mesh rotation-x={-Math.PI / 2} position={[0, -.1, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#d8d0c4" roughness={.95} /></mesh>
    <MorphingRoom room={room} active={active} onSelect={onSelect} zoom={zoom} />
    <OrbitControls ref={controls} makeDefault enablePan={pan} enableZoom={false} minDistance={3} maxDistance={20}
      minPolarAngle={.4} maxPolarAngle={1.4} autoRotate={running && rotate && !reduced} autoRotateSpeed={.8}
      onStart={() => { travelling.current = false; gl.domElement.dataset.cameraMoving = 'false' }} enableDamping dampingFactor={.08} target={[0, .9, -.05]} />
  </>
}

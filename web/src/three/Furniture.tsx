import type { ThreeEvent } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

/* Maderas de la marca (paleta de nogal y roble). */
const walnut = '#8C6A49'
const walnutDark = '#5E4530'
const oak = '#C4A179'
const oakLight = '#D9BE9C'

interface PieceProps {
  position?: [number, number, number]
  active: boolean
  onSelect: (name: string) => void
}

/** Pata cónica: cilindro con radio superior menor que el inferior. */
function Leg({
  position,
  height,
  color,
  topRadius = 0.032,
  bottomRadius = 0.05,
}: {
  position: [number, number, number]
  height: number
  color: string
  topRadius?: number
  bottomRadius?: number
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[topRadius, bottomRadius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.04} />
    </mesh>
  )
}

function stop(event: ThreeEvent<MouseEvent>) {
  event.stopPropagation()
}

/** Comedor: mesa de 6 plazas con sobre redondeado, faldón y patas cónicas. */
export function DiningTable({ active, onSelect, position = [-1.55, 0, 0] }: PieceProps) {
  return (
    <group
      position={position}
      scale={active ? 1.02 : 1}
      onClick={(e) => {
        stop(e)
        onSelect('Comedor')
      }}
    >
      <RoundedBox
        args={[1.7, 0.07, 0.9]}
        radius={0.035}
        smoothness={5}
        position={[0, 0.76, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={oak} roughness={0.38} metalness={0.04} />
      </RoundedBox>

      {/* Faldón longitudinal y transversal */}
      <RoundedBox args={[1.6, 0.09, 0.05]} radius={0.012} position={[0, 0.685, 0.37]} castShadow>
        <meshStandardMaterial color={oak} roughness={0.5} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[1.6, 0.09, 0.05]} radius={0.012} position={[0, 0.685, -0.37]} castShadow>
        <meshStandardMaterial color={oak} roughness={0.5} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[0.05, 0.09, 0.8]} radius={0.012} position={[0.71, 0.685, 0]} castShadow>
        <meshStandardMaterial color={oak} roughness={0.5} metalness={0.04} />
      </RoundedBox>
      <RoundedBox args={[0.05, 0.09, 0.8]} radius={0.012} position={[-0.71, 0.685, 0]} castShadow>
        <meshStandardMaterial color={oak} roughness={0.5} metalness={0.04} />
      </RoundedBox>

      <Leg position={[0.68, 0.345, 0.33]} height={0.69} color={oak} />
      <Leg position={[-0.68, 0.345, 0.33]} height={0.69} color={oak} />
      <Leg position={[0.68, 0.345, -0.33]} height={0.69} color={oak} />
      <Leg position={[-0.68, 0.345, -0.33]} height={0.69} color={oak} />
    </group>
  )
}

/** Centro de mesa: sobre redondeado, entrepaño inferior y patas bajas. */
export function CoffeeTable({ active, onSelect, position = [0, 0, 0.1] }: PieceProps) {
  return (
    <group
      position={position}
      scale={active ? 1.02 : 1}
      onClick={(e) => {
        stop(e)
        onSelect('Centro de mesa')
      }}
    >
      <RoundedBox
        args={[1.05, 0.055, 0.55]}
        radius={0.03}
        smoothness={5}
        position={[0, 0.43, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={walnut} roughness={0.42} metalness={0.05} />
      </RoundedBox>

      <RoundedBox
        args={[0.82, 0.03, 0.4]}
        radius={0.012}
        position={[0, 0.18, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={walnutDark} roughness={0.55} metalness={0.05} />
      </RoundedBox>

      <Leg position={[0.45, 0.19, 0.2]} height={0.38} color={walnutDark} />
      <Leg position={[-0.45, 0.19, 0.2]} height={0.38} color={walnutDark} />
      <Leg position={[0.45, 0.19, -0.2]} height={0.38} color={walnutDark} />
      <Leg position={[-0.45, 0.19, -0.2]} height={0.38} color={walnutDark} />
    </group>
  )
}

/** Mesa de TV (sala): mueble bajo con frentes de cajones y pies cortos. */
export function TvStand({ active, onSelect, position = [1.55, 0, 0] }: PieceProps) {
  return (
    <group
      position={position}
      scale={active ? 1.02 : 1}
      onClick={(e) => {
        stop(e)
        onSelect('Mesa de TV')
      }}
    >
      {/* Cuerpo */}
      <RoundedBox
        args={[1.7, 0.38, 0.42]}
        radius={0.025}
        smoothness={4}
        position={[0, 0.26, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={walnutDark} roughness={0.55} metalness={0.05} />
      </RoundedBox>

      {/* Frentes de cajón */}
      <RoundedBox args={[0.74, 0.3, 0.02]} radius={0.012} position={[-0.42, 0.26, 0.215]} castShadow>
        <meshStandardMaterial color={walnut} roughness={0.45} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[0.74, 0.3, 0.02]} radius={0.012} position={[0.42, 0.26, 0.215]} castShadow>
        <meshStandardMaterial color={walnut} roughness={0.45} metalness={0.05} />
      </RoundedBox>

      {/* Sobre superior */}
      <RoundedBox args={[1.74, 0.05, 0.46]} radius={0.02} position={[0, 0.47, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={oakLight} roughness={0.4} metalness={0.04} />
      </RoundedBox>

      {/* Pies */}
      <Leg position={[0.72, 0.035, 0.16]} height={0.07} topRadius={0.02} bottomRadius={0.03} color={walnutDark} />
      <Leg position={[-0.72, 0.035, 0.16]} height={0.07} topRadius={0.02} bottomRadius={0.03} color={walnutDark} />
      <Leg position={[0.72, 0.035, -0.16]} height={0.07} topRadius={0.02} bottomRadius={0.03} color={walnutDark} />
      <Leg position={[-0.72, 0.035, -0.16]} height={0.07} topRadius={0.02} bottomRadius={0.03} color={walnutDark} />
    </group>
  )
}

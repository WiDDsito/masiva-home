import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

interface Props { children: ReactNode; strength?: number; className?: string }

/** A stable hit area keeps the spring from shifting its own pointer coordinates. */
export function Magnetic({ children, strength = 0.28, className = '' }: Props) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.1 })
  const reset = () => { x.set(0); y.set(0) }
  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }
  return <div className={`magnetic ${className}`.trim()} onMouseMove={move} onMouseLeave={reset} onBlur={reset}>
    <motion.div className="magnetic__surface" style={reduced ? undefined : { x: springX, y: springY }}>{children}</motion.div>
  </div>
}

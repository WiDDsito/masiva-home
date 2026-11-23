import { rooms } from '../content/showroom'
import type { RoomId } from '../content/showroom'

export const showroomCenter: [number, number, number] = [0, .9, -.05]

export function showroomCamera(room: RoomId, aspect: number) {
  const factor = 1 + Math.min(.9, Math.max(0, (1.15 - aspect) * 1.4))
  const [x, y, z] = rooms[room].camera
  const position: [number, number, number] = [x * factor, y * factor, z * factor]
  return { position, target: showroomCenter }
}

import { rooms, showroomPieces } from '../content/showroom'
import type { RoomId } from '../content/showroom'

export function showroomCamera(room: RoomId, active: string | null, aspect: number, zoom = 1) {
  const center: [number,number,number] = [0,.9,-.05]
  const factor = aspect < 1 ? 1.9 : 1
  const position = rooms[room].camera.map(value=>value*factor) as [number,number,number]
  const selected = showroomPieces.find(piece=>piece.name===active && piece.room===room)
  if (!selected) return { position, target: center }
  const target = selected.focus.map(value=>value*zoom) as [number,number,number]
  return { position: position.map((value,index)=>target[index]+(value-center[index])*.84) as [number,number,number], target }
}

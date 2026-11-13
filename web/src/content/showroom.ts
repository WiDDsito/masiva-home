export type RoomId = 'sala' | 'comedor' | 'dormitorio'
export const rooms: Record<RoomId, { label: string; background: string; camera: [number, number, number]; description: string }> = {
  sala: { label: 'Sala', background: '#d5d0c7', camera: [5.2,3.8,6.8], description: 'Encuentra tu forma de estar.' },
  comedor: { label: 'Comedor', background: '#ded5c8', camera: [4.9,3.5,6.6], description: 'Un espacio para compartir.' },
  dormitorio: { label: 'Dormitorio', background: '#d3d4cf', camera: [5.2,3.7,6.8], description: 'Un espacio para descansar.' },
}
export const showroomPieces: { name: string; room: RoomId; productId: string; focus: [number,number,number]; detail: string }[] = [
  {name:'Centro de mesa',room:'sala',productId:'fabela',focus:[-.3,.24,.3],detail:'Fabela: sobre negro, nicho abierto, cajón lateral y patas negras.'},
  {name:'Mesa de TV',room:'sala',productId:'kevin',focus:[.9,.3,-1.7],detail:'Kevin: estructura de madera, frentes plomo y compartimentos abiertos.'},
  {name:'Aparador Escanor',room:'comedor',productId:'escanor',focus:[-.7,.5,-1.7],detail:'Escanor: volúmenes diagonales en madera sobre una base blanca escalonada.'},
  {name:'Ropero',room:'dormitorio',productId:'runa',focus:[.75,1.1,-1.65],detail:'Runa: seis puertas, laterales claros y centro de madera acanalada.'},
]

import type { Gender } from './npcs'

export interface Player {
  id: string
  name: string
  gender: Gender
}

export const players: Player[] = [
  { id: 'aksel', name: 'Aksel', gender: 'male' },
  { id: 'corhin', name: 'Corhin', gender: 'male' },
  { id: 'izar', name: 'Izar', gender: 'male' }
]

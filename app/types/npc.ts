export interface Npc {
  id: string
  name: string
  displayName?: string
  image: string
  leonardoImageId?: string
  images: NpcImage[]
  species?: string
  gender?: string
  age?: string
  role?: string
  description: string
  appearanceDescription?: string
  away: boolean
  introduced: boolean
  seen: boolean
  groupId?: string
}

export interface NpcImage {
  image: string
  label: string
  leonardoImageId?: string
}

export interface NpcGroup {
  id: string
  name: string
}

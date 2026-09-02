export interface Npc {
  id: string
  name: string
  image: string
  leonardoImageId?: string
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

export interface Player {
  id: string
  name: string
}

export interface NpcGroup {
  id: string
  name: string
}

export interface GalleryImage {
  id: string
  image: string
}

export type Item = GalleryImage

export type Location = GalleryImage

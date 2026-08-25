export interface Npc {
  id: string
  name: string
  image: string
  description: string
  away: boolean
  introduced: boolean
  seen: boolean
}

export interface Player {
  id: string
  name: string
}

export interface GalleryImage {
  id: string
  image: string
}

export type Item = GalleryImage

export type Location = GalleryImage

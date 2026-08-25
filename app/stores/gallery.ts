import type { GalleryImage } from '~/types/cast'

const ITEMS_KEY = 'dm-presenter:items'
const LOCATIONS_KEY = 'dm-presenter:locations'

export const useItemsStore = defineStore('items', () => {
  const items = ref<GalleryImage[]>([])

  function addItem(image: string): void {
    items.value = [...items.value, { id: crypto.randomUUID(), image }]
  }

  function removeItem(id: string): void {
    items.value = items.value.filter(entry => entry.id !== id)
  }

  return { items, addItem, removeItem }
}, {
  persist: { key: ITEMS_KEY, ...fieldPersistence('items', isGalleryImageArray, () => []) }
})

export const useLocationsStore = defineStore('locations', () => {
  const locations = ref<GalleryImage[]>([])

  function addLocation(image: string): void {
    locations.value = [...locations.value, { id: crypto.randomUUID(), image }]
  }

  function removeLocation(id: string): void {
    locations.value = locations.value.filter(entry => entry.id !== id)
  }

  return { locations, addLocation, removeLocation }
}, {
  persist: { key: LOCATIONS_KEY, ...fieldPersistence('locations', isGalleryImageArray, () => []) }
})

function isGalleryImageArray(value: unknown): value is GalleryImage[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.image === 'string'
  )
}

import type { Item } from '~/types/cast'

const ITEMS_KEY = 'dm-presenter:items'

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])

  function addItem(image: string, name = ''): void {
    items.value = [...items.value, { id: crypto.randomUUID(), image, name }]
  }

  function removeItem(id: string): void {
    items.value = items.value.filter(entry => entry.id !== id)
  }

  function renameItem(id: string, name: string): void {
    items.value = items.value.map(entry => entry.id === id ? { ...entry, name } : entry)
  }

  function reorderItems(orderedIds: string[]): void {
    items.value = reorderById(items.value, orderedIds)
  }

  return { items, addItem, removeItem, renameItem, reorderItems }
}, {
  persist: {
    key: ITEMS_KEY,
    serializer: {
      serialize: state => JSON.stringify(state.items),
      deserialize: (raw) => {
        const parsed: unknown = JSON.parse(raw)

        if (!isStoredItemArray(parsed)) {
          return { items: [] }
        }

        return { items: parsed.map(item => ({ name: '', ...item })) }
      }
    }
  }
})

type StoredItem = Omit<Item, 'name'> & Partial<Pick<Item, 'name'>>

function isStoredItemArray(value: unknown): value is StoredItem[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.image === 'string'
    && (entry.name === undefined || typeof entry.name === 'string')
  )
}

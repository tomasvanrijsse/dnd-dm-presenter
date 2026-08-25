import type { Npc } from '~/types/cast'

export const NPCS_KEY = 'dm-presenter:npcs'

export const useNpcsStore = defineStore('npcs', () => {
  const npcs = ref<Npc[]>([])

  function addNpc(input: Omit<Npc, 'id'>): void {
    npcs.value = [...npcs.value, { ...input, id: uniqueId(input.name, npcs.value) }]
  }

  function updateNpc(id: string, patch: Partial<Omit<Npc, 'id'>>): void {
    npcs.value = npcs.value.map(npc => npc.id === id ? { ...npc, ...patch } : npc)
  }

  function removeNpc(id: string): void {
    npcs.value = npcs.value.filter(npc => npc.id !== id)
  }

  return {
    npcs,
    addNpc,
    updateNpc,
    removeNpc
  }
}, {
  persist: { key: NPCS_KEY, ...fieldPersistence('npcs', isNpcArray, () => []) }
})

function isNpcArray(value: unknown): value is Npc[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.name === 'string'
    && typeof entry.image === 'string'
    && typeof entry.description === 'string'
  )
}

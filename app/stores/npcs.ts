import type { Npc } from '~/types/cast'

export const NPCS_KEY = 'dm-presenter:npcs'

type NpcFlag = 'away' | 'introduced' | 'seen'

export const useNpcsStore = defineStore('npcs', () => {
  const npcs = ref<Npc[]>([])

  function addNpc(input: Omit<Npc, 'id' | 'away' | 'introduced' | 'seen'>): void {
    npcs.value = [...npcs.value, { ...input, id: uniqueId(input.name, npcs.value), away: true, introduced: false, seen: false }]
  }

  function updateNpc(id: string, patch: Partial<Omit<Npc, 'id'>>): void {
    npcs.value = npcs.value.map(npc => npc.id === id ? { ...npc, ...patch } : npc)
  }

  function removeNpc(id: string): void {
    npcs.value = npcs.value.filter(npc => npc.id !== id)
  }

  function isFlagSet(id: string, flag: NpcFlag): boolean {
    return npcs.value.find(npc => npc.id === id)?.[flag] === true
  }

  function toggleFlag(id: string, flag: NpcFlag): void {
    updateNpc(id, { [flag]: !isFlagSet(id, flag) })
  }

  function isAway(id: string): boolean {
    return isFlagSet(id, 'away')
  }

  function toggleAway(id: string): void {
    toggleFlag(id, 'away')
  }

  function allAway(ids: string[]): boolean {
    return ids.length > 0 && ids.every(isAway)
  }

  function toggleAwayForAll(ids: string[]): void {
    const value = !allAway(ids)

    npcs.value = npcs.value.map(npc => ids.includes(npc.id) ? { ...npc, away: value } : npc)
  }

  function isIntroduced(id: string): boolean {
    return isFlagSet(id, 'introduced')
  }

  function toggleIntroduced(id: string): void {
    toggleFlag(id, 'introduced')
  }

  function isSeen(id: string): boolean {
    return isFlagSet(id, 'seen')
  }

  function toggleSeen(id: string): void {
    toggleFlag(id, 'seen')
  }

  return {
    npcs,
    addNpc,
    updateNpc,
    removeNpc,
    isAway,
    toggleAway,
    allAway,
    toggleAwayForAll,
    isIntroduced,
    toggleIntroduced,
    isSeen,
    toggleSeen
  }
}, {
  persist: {
    key: NPCS_KEY,
    serializer: {
      serialize: state => JSON.stringify(state.npcs),
      deserialize: (raw) => {
        const parsed: unknown = JSON.parse(raw)

        if (!isStoredNpcArray(parsed)) {
          return { npcs: [] }
        }

        return { npcs: parsed.map(npc => ({ away: false, introduced: false, seen: false, ...npc })) }
      }
    }
  }
})

type StoredNpc = Omit<Npc, 'away' | 'introduced' | 'seen'> & Partial<Pick<Npc, 'away' | 'introduced' | 'seen'>>

function isStoredNpcArray(value: unknown): value is StoredNpc[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.name === 'string'
    && typeof entry.image === 'string'
    && typeof entry.description === 'string'
  )
}

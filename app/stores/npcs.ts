import type { Npc, NpcImage } from '~/types/npc'

export const NPCS_KEY = 'dm-presenter:npcs'

export type NpcFlag = 'away' | 'introduced' | 'seen'

export const useNpcsStore = defineStore('npcs', () => {
  const npcs = ref<Npc[]>([])

  function addNpc(input: Omit<Npc, 'id' | 'away' | 'introduced' | 'seen'>): void {
    npcs.value = [...npcs.value, { ...input, id: uniqueId(input.name, npcs.value), away: true, introduced: false, seen: true }]
  }

  function updateNpc(id: string, patch: Partial<Omit<Npc, 'id'>>): void {
    const before = npcs.value.find(npc => npc.id === id)

    npcs.value = npcs.value.map(npc => npc.id === id ? { ...npc, ...patch } : npc)

    const kept = new Set(npcs.value.filter(npc => npc.id === id).flatMap(imageOwners).map(owner => owner.image))

    void releaseImages(before ? imageOwners(before).filter(owner => !kept.has(owner.image)) : [])
  }

  function removeNpc(id: string): void {
    const removed = npcs.value.filter(npc => npc.id === id)

    npcs.value = npcs.value.filter(npc => npc.id !== id)

    void releaseImages(removed.flatMap(imageOwners))
  }

  function selectImage(id: string, image: string): void {
    const selected = npcs.value.find(npc => npc.id === id)?.images.find(entry => entry.image === image)

    if (selected) {
      updateNpc(id, { image: selected.image, leonardoImageId: selected.leonardoImageId })
    }
  }

  function isFlagSet(id: string, flag: NpcFlag): boolean {
    return npcs.value.find(npc => npc.id === id)?.[flag] === true
  }

  function toggleFlag(id: string, flag: NpcFlag): void {
    updateNpc(id, { [flag]: !isFlagSet(id, flag) })
  }

  function allAway(ids: string[]): boolean {
    return ids.length > 0 && ids.every(id => isFlagSet(id, 'away'))
  }

  function toggleAwayForAll(ids: string[]): void {
    const value = !allAway(ids)

    npcs.value = npcs.value.map(npc => ids.includes(npc.id) ? { ...npc, away: value } : npc)
  }

  function reorderSubset(orderedIds: string[]): void {
    const memberIds = new Set(orderedIds)
    const firstIndex = npcs.value.findIndex(npc => memberIds.has(npc.id))

    if (firstIndex === -1) {
      return
    }

    const others = npcs.value.filter(npc => !memberIds.has(npc.id))
    const insertAt = npcs.value.slice(0, firstIndex).filter(npc => !memberIds.has(npc.id)).length
    const ordered = reorderById(npcs.value, orderedIds)

    npcs.value = [...others.slice(0, insertAt), ...ordered, ...others.slice(insertAt)]
  }

  return {
    npcs,
    addNpc,
    updateNpc,
    removeNpc,
    selectImage,
    isFlagSet,
    toggleFlag,
    allAway,
    toggleAwayForAll,
    reorderSubset
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

        return { npcs: parsed.map(npc => ({ away: false, introduced: false, seen: true, images: defaultImages(npc), ...npc })) }
      }
    }
  }
})

export type StoredNpc = Omit<Npc, 'away' | 'introduced' | 'seen' | 'images'> & Partial<Pick<Npc, 'away' | 'introduced' | 'seen' | 'images'>>

export function isStoredNpcArray(value: unknown): value is StoredNpc[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.name === 'string'
    && typeof entry.image === 'string'
    && typeof entry.description === 'string'
    && (entry.images === undefined || isNpcImageArray(entry.images))
  )
}

function isNpcImageArray(value: unknown): value is NpcImage[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry) && typeof entry.image === 'string' && typeof entry.label === 'string'
  )
}

function defaultImages(npc: StoredNpc): NpcImage[] {
  return npc.image ? [{ image: npc.image, label: 'Default', leonardoImageId: npc.leonardoImageId }] : []
}

function imageOwners(npc: Npc): ImageOwner[] {
  return [npc, ...npc.images]
}

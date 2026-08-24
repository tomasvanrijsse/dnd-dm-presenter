import type { Npc, Player } from '~/types/cast'

export const NPCS_KEY = 'dm-presenter:npcs'
const PLAYERS_KEY = 'dm-presenter:players'

export function useNpcs() {
  const npcs = useState<Npc[]>('npcs', () => [])
  const hydrated = useState<boolean>('npcs-hydrated', () => false)

  function addNpc(input: Omit<Npc, 'id'>): void {
    npcs.value = [...npcs.value, { ...input, id: uniqueId(input.name, npcs.value) }]
    persist()
  }

  function updateNpc(id: string, patch: Partial<Omit<Npc, 'id'>>): void {
    npcs.value = npcs.value.map(npc => npc.id === id ? { ...npc, ...patch } : npc)
    persist()
  }

  function removeNpc(id: string): void {
    npcs.value = npcs.value.filter(npc => npc.id !== id)
    persist()
  }

  onMounted(() => {
    npcs.value = readList(NPCS_KEY, isNpcArray)
    hydrated.value = true

    window.addEventListener('storage', onStorage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
  })

  function onStorage(event: StorageEvent): void {
    if (event.key === NPCS_KEY) {
      npcs.value = readList(NPCS_KEY, isNpcArray)
    }
  }

  function persist(): void {
    window.localStorage.setItem(NPCS_KEY, JSON.stringify(npcs.value))
  }

  return {
    npcs,
    hydrated,
    addNpc,
    updateNpc,
    removeNpc
  }
}

export function usePlayers() {
  const players = useState<Player[]>('players', () => [])
  const hydrated = useState<boolean>('players-hydrated', () => false)

  function addPlayer(input: Omit<Player, 'id'>): void {
    players.value = [...players.value, { ...input, id: uniqueId(input.name, players.value) }]
    persist()
  }

  function updatePlayer(id: string, patch: Partial<Omit<Player, 'id'>>): void {
    players.value = players.value.map(player => player.id === id ? { ...player, ...patch } : player)
    persist()
  }

  function removePlayer(id: string): void {
    players.value = players.value.filter(player => player.id !== id)
    persist()
  }

  onMounted(() => {
    players.value = readList(PLAYERS_KEY, isPlayerArray)
    hydrated.value = true

    window.addEventListener('storage', onStorage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
  })

  function onStorage(event: StorageEvent): void {
    if (event.key === PLAYERS_KEY) {
      players.value = readList(PLAYERS_KEY, isPlayerArray)
    }
  }

  function persist(): void {
    window.localStorage.setItem(PLAYERS_KEY, JSON.stringify(players.value))
  }

  return {
    players,
    hydrated,
    addPlayer,
    updatePlayer,
    removePlayer
  }
}

function slugify(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'entry'
}

function uniqueId(name: string, existing: { id: string }[]): string {
  const base = slugify(name)
  const existingIds = new Set(existing.map(entry => entry.id))

  if (!existingIds.has(base)) {
    return base
  }

  let suffix = 2

  while (existingIds.has(`${base}-${suffix}`)) {
    suffix += 1
  }

  return `${base}-${suffix}`
}

function readList<T>(key: string, isValid: (value: unknown) => value is T[]): T[] {
  const raw = window.localStorage.getItem(key)

  if (!raw) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    return isValid(parsed) ? parsed : []
  } catch {
    return []
  }
}

function isNpcArray(value: unknown): value is Npc[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.name === 'string'
    && typeof entry.image === 'string'
    && typeof entry.description === 'string'
  )
}

function isPlayerArray(value: unknown): value is Player[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.name === 'string'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

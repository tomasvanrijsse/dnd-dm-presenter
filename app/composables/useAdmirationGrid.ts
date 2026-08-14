const POINTS_KEY = 'dnd-wedding:admiration-points'
const AWAY_KEY = 'dnd-wedding:away-npcs'
const INTRODUCED_KEY = 'dnd-wedding:introduced-npcs'

type AdmirationPoints = Record<string, number>
type NpcFlags = Record<string, boolean>

export function useAdmirationGrid() {
  const points = useState<AdmirationPoints>('admiration-points', () => ({}))
  const hydrated = useState<boolean>('admiration-points-hydrated', () => false)

  const away = useBooleanFlags(AWAY_KEY, 'away-npcs')
  const introduced = useBooleanFlags(INTRODUCED_KEY, 'introduced-npcs')

  function pointsFor(npcId: string, playerId: string): number {
    return points.value[cellKey(npcId, playerId)] ?? 0
  }

  function adjust(npcId: string, playerId: string, delta: number): void {
    setPoints(npcId, playerId, pointsFor(npcId, playerId) + delta)
  }

  function setPoints(npcId: string, playerId: string, value: number): void {
    points.value = { ...points.value, [cellKey(npcId, playerId)]: value }
    persistPoints()
  }

  function reset(): void {
    points.value = {}
    persistPoints()
  }

  onMounted(() => {
    points.value = readPoints()
    away.read()
    introduced.read()
    hydrated.value = true

    window.addEventListener('storage', onStorage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
  })

  function onStorage(event: StorageEvent): void {
    if (event.key === POINTS_KEY) {
      points.value = readPoints()
    }

    away.onStorage(event)
    introduced.onStorage(event)
  }

  function readPoints(): AdmirationPoints {
    return readRecord(POINTS_KEY, isAdmirationPoints)
  }

  function persistPoints(): void {
    window.localStorage.setItem(POINTS_KEY, JSON.stringify(points.value))
  }

  return {
    points,
    away: away.flags,
    introduced: introduced.flags,
    hydrated,
    pointsFor,
    adjust,
    setPoints,
    isAway: away.isSet,
    toggleAway: away.toggle,
    allAway: away.allSet,
    toggleAwayForAll: away.toggleForAll,
    isIntroduced: introduced.isSet,
    toggleIntroduced: introduced.toggle,
    reset
  }
}

function useBooleanFlags(storageKey: string, stateKey: string) {
  const flags = useState<NpcFlags>(stateKey, () => ({}))

  function isSet(npcId: string): boolean {
    return flags.value[npcId] === true
  }

  function toggle(npcId: string): void {
    flags.value = { ...flags.value, [npcId]: !isSet(npcId) }
    persist()
  }

  function allSet(npcIds: string[]): boolean {
    return npcIds.length > 0 && npcIds.every(isSet)
  }

  function toggleForAll(npcIds: string[]): void {
    const value = !allSet(npcIds)

    flags.value = { ...flags.value, ...Object.fromEntries(npcIds.map(npcId => [npcId, value])) }
    persist()
  }

  function read(): void {
    flags.value = readRecord(storageKey, isNpcFlags)
  }

  function persist(): void {
    window.localStorage.setItem(storageKey, JSON.stringify(flags.value))
  }

  function onStorage(event: StorageEvent): void {
    if (event.key === storageKey) {
      read()
    }
  }

  return { flags, isSet, toggle, allSet, toggleForAll, read, onStorage }
}

function cellKey(npcId: string, playerId: string): string {
  return `${npcId}:${playerId}`
}

function readRecord<T>(key: string, isValid: (value: unknown) => value is T): T | Record<string, never> {
  const raw = window.localStorage.getItem(key)

  if (!raw) {
    return {}
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    return isValid(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function isAdmirationPoints(value: unknown): value is AdmirationPoints {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'number')
}

function isNpcFlags(value: unknown): value is NpcFlags {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'boolean')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

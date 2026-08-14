const POINTS_KEY = 'dnd-wedding:admiration-points'
const AWAY_KEY = 'dnd-wedding:away-npcs'

type AdmirationPoints = Record<string, number>
type AwayNpcs = Record<string, boolean>

export function useAdmirationGrid() {
  const points = useState<AdmirationPoints>('admiration-points', () => ({}))
  const away = useState<AwayNpcs>('away-npcs', () => ({}))
  const hydrated = useState<boolean>('admiration-points-hydrated', () => false)

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

  function isAway(npcId: string): boolean {
    return away.value[npcId] === true
  }

  function toggleAway(npcId: string): void {
    away.value = { ...away.value, [npcId]: !isAway(npcId) }
    persistAway()
  }

  function allAway(npcIds: string[]): boolean {
    return npcIds.length > 0 && npcIds.every(isAway)
  }

  function toggleAwayForAll(npcIds: string[]): void {
    const goAway = !allAway(npcIds)

    away.value = { ...away.value, ...Object.fromEntries(npcIds.map(npcId => [npcId, goAway])) }
    persistAway()
  }

  function totalForPlayer(playerId: string, npcIds: string[]): number {
    return npcIds.reduce((total, npcId) => total + pointsFor(npcId, playerId), 0)
  }

  function totalForNpc(npcId: string, playerIds: string[]): number {
    return playerIds.reduce((total, playerId) => total + pointsFor(npcId, playerId), 0)
  }

  function reset(): void {
    points.value = {}
    persistPoints()
  }

  onMounted(() => {
    points.value = readPoints()
    away.value = readAway()
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

    if (event.key === AWAY_KEY) {
      away.value = readAway()
    }
  }

  function readPoints(): AdmirationPoints {
    return readRecord(POINTS_KEY, isAdmirationPoints)
  }

  function readAway(): AwayNpcs {
    return readRecord(AWAY_KEY, isAwayNpcs)
  }

  function persistPoints(): void {
    window.localStorage.setItem(POINTS_KEY, JSON.stringify(points.value))
  }

  function persistAway(): void {
    window.localStorage.setItem(AWAY_KEY, JSON.stringify(away.value))
  }

  return {
    points,
    away,
    hydrated,
    pointsFor,
    adjust,
    setPoints,
    isAway,
    toggleAway,
    allAway,
    toggleAwayForAll,
    totalForPlayer,
    totalForNpc,
    reset
  }
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

function isAwayNpcs(value: unknown): value is AwayNpcs {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'boolean')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

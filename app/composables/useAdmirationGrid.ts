const STORAGE_KEY = 'dnd-wedding:admiration-points'

type AdmirationPoints = Record<string, number>

export function useAdmirationGrid() {
  const points = useState<AdmirationPoints>('admiration-points', () => ({}))
  const hydrated = useState<boolean>('admiration-points-hydrated', () => false)

  function pointsFor(npcId: string, playerId: string): number {
    return points.value[cellKey(npcId, playerId)] ?? 0
  }

  function adjust(npcId: string, playerId: string, delta: number): void {
    setPoints(npcId, playerId, pointsFor(npcId, playerId) + delta)
  }

  function setPoints(npcId: string, playerId: string, value: number): void {
    points.value = { ...points.value, [cellKey(npcId, playerId)]: value }
    persist()
  }

  function totalForPlayer(playerId: string, npcIds: string[]): number {
    return npcIds.reduce((total, npcId) => total + pointsFor(npcId, playerId), 0)
  }

  function totalForNpc(npcId: string, playerIds: string[]): number {
    return playerIds.reduce((total, playerId) => total + pointsFor(npcId, playerId), 0)
  }

  function reset(): void {
    points.value = {}
    persist()
  }

  onMounted(() => {
    points.value = read()
    hydrated.value = true

    window.addEventListener('storage', onStorage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
  })

  function onStorage(event: StorageEvent): void {
    if (event.key !== STORAGE_KEY) {
      return
    }

    points.value = read()
  }

  function read(): AdmirationPoints {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return {}
    }

    try {
      const parsed: unknown = JSON.parse(raw)

      return isAdmirationPoints(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }

  function persist(): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(points.value))
  }

  return { points, hydrated, pointsFor, adjust, setPoints, totalForPlayer, totalForNpc, reset }
}

function cellKey(npcId: string, playerId: string): string {
  return `${npcId}:${playerId}`
}

function isAdmirationPoints(value: unknown): value is AdmirationPoints {
  return typeof value === 'object'
    && value !== null
    && Object.values(value).every(entry => typeof entry === 'number')
}

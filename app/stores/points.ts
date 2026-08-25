const POINTS_KEY = 'dm-presenter:points'

type Points = Record<string, number>

export const usePointsStore = defineStore('points', () => {
  const points = ref<Points>({})

  function pointsFor(npcId: string, playerId: string): number {
    return points.value[cellKey(npcId, playerId)] ?? 0
  }

  function adjust(npcId: string, playerId: string, delta: number): void {
    setPoints(npcId, playerId, pointsFor(npcId, playerId) + delta)
  }

  function setPoints(npcId: string, playerId: string, value: number): void {
    points.value = { ...points.value, [cellKey(npcId, playerId)]: value }
  }

  function reset(): void {
    points.value = {}
  }

  return { points, pointsFor, adjust, setPoints, reset }
}, {
  persist: { key: POINTS_KEY, ...fieldPersistence('points', isPoints, () => ({})) }
})

function cellKey(npcId: string, playerId: string): string {
  return `${npcId}:${playerId}`
}

function isPoints(value: unknown): value is Points {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'number')
}

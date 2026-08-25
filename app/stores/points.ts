import type { Ref } from 'vue'

const POINTS_KEY = 'dm-presenter:points'
const AWAY_KEY = 'dm-presenter:away-npcs'
const INTRODUCED_KEY = 'dm-presenter:introduced-npcs'
const SEEN_KEY = 'dm-presenter:seen-npcs'

type Points = Record<string, number>
type NpcFlags = Record<string, boolean>

export const usePointsStore = defineStore('points', () => {
  const points = ref<Points>({})
  const away = ref<NpcFlags>({})
  const introduced = ref<NpcFlags>({})
  const seen = ref<NpcFlags>({})

  const awayFlags = useBooleanFlags(away)
  const introducedFlags = useBooleanFlags(introduced)
  const seenFlags = useBooleanFlags(seen)

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

  return {
    points,
    away,
    introduced,
    seen,
    pointsFor,
    adjust,
    setPoints,
    isAway: awayFlags.isSet,
    toggleAway: awayFlags.toggle,
    allAway: awayFlags.allSet,
    toggleAwayForAll: awayFlags.toggleForAll,
    isIntroduced: introducedFlags.isSet,
    toggleIntroduced: introducedFlags.toggle,
    isSeen: seenFlags.isSet,
    toggleSeen: seenFlags.toggle,
    reset
  }
}, {
  persist: [
    { key: POINTS_KEY, ...fieldPersistence('points', isPoints, () => ({})) },
    { key: AWAY_KEY, ...fieldPersistence('away', isNpcFlags, () => ({})) },
    { key: INTRODUCED_KEY, ...fieldPersistence('introduced', isNpcFlags, () => ({})) },
    { key: SEEN_KEY, ...fieldPersistence('seen', isNpcFlags, () => ({})) }
  ]
})

function useBooleanFlags(flags: Ref<NpcFlags>) {
  function isSet(npcId: string): boolean {
    return flags.value[npcId] === true
  }

  function toggle(npcId: string): void {
    flags.value = { ...flags.value, [npcId]: !isSet(npcId) }
  }

  function allSet(npcIds: string[]): boolean {
    return npcIds.length > 0 && npcIds.every(isSet)
  }

  function toggleForAll(npcIds: string[]): void {
    const value = !allSet(npcIds)

    flags.value = { ...flags.value, ...Object.fromEntries(npcIds.map(npcId => [npcId, value])) }
  }

  return { isSet, toggle, allSet, toggleForAll }
}

function cellKey(npcId: string, playerId: string): string {
  return `${npcId}:${playerId}`
}

function isPoints(value: unknown): value is Points {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'number')
}

function isNpcFlags(value: unknown): value is NpcFlags {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'boolean')
}

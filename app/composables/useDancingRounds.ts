const ASSIGNMENTS_KEY = 'dnd-wedding:dancing-assignments'

export const DANCING_ROUNDS = 9
export const NOT_DANCING_SLOT = 'not-dancing'
export const COUPLE_SLOTS = [1, 2, 3, 4, 5, 6].map(n => `couple-${n}`)
export const AWAY_SLOT = 'away'
export const DANCING_SLOTS = [NOT_DANCING_SLOT, ...COUPLE_SLOTS, AWAY_SLOT]

type Assignments = Record<string, string>

export function useDancingRounds() {
  const assignments = useState<Assignments>('dancing-assignments', () => ({}))
  const hydrated = useState<boolean>('dancing-assignments-hydrated', () => false)

  function slotFor(round: number, participantId: string): string {
    return assignments.value[key(round, participantId)] ?? NOT_DANCING_SLOT
  }

  function participantsInSlot(round: number, slotId: string, participantIds: string[]): string[] {
    return participantIds.filter(id => slotFor(round, id) === slotId)
  }

  function assign(round: number, participantId: string, slotId: string): void {
    const cellKey = key(round, participantId)

    assignments.value = slotId === NOT_DANCING_SLOT
      ? Object.fromEntries(Object.entries(assignments.value).filter(([entryKey]) => entryKey !== cellKey))
      : { ...assignments.value, [cellKey]: slotId }

    persist()
  }

  onMounted(() => {
    assignments.value = readAssignments()
    hydrated.value = true

    window.addEventListener('storage', onStorage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
  })

  function onStorage(event: StorageEvent): void {
    if (event.key === ASSIGNMENTS_KEY) {
      assignments.value = readAssignments()
    }
  }

  function readAssignments(): Assignments {
    const raw = window.localStorage.getItem(ASSIGNMENTS_KEY)

    if (!raw) {
      return {}
    }

    try {
      const parsed: unknown = JSON.parse(raw)

      return isAssignments(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }

  function persist(): void {
    window.localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments.value))
  }

  return {
    hydrated,
    slotFor,
    participantsInSlot,
    assign
  }
}

function key(round: number, participantId: string): string {
  return `${round}:${participantId}`
}

function isAssignments(value: unknown): value is Assignments {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && Object.values(value).every(entry => typeof entry === 'string')
}

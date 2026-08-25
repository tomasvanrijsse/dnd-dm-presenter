export interface SessionRow {
  id: string
  title: string
  description: string
}

const ROWS_KEY = 'dm-presenter:session-rows'
const ASSIGNMENTS_KEY = 'dm-presenter:session-assignments'

export const UNASSIGNED_SLOT = 'unassigned'
export const GROUP_SLOTS = [1, 2, 3, 4, 5, 6].map(n => `group-${n}`)
export const AWAY_SLOT = 'away'

type Assignments = Record<string, string>

export function useSessionEvents() {
  const rows = useState<SessionRow[]>('session-rows', () => [])
  const assignments = useState<Assignments>('session-assignments', () => ({}))
  const hydrated = useState<boolean>('session-events-hydrated', () => false)

  function addRow(): void {
    rows.value = [...rows.value, { id: crypto.randomUUID(), title: `Round ${rows.value.length + 1}`, description: '' }]
    persistRows()
  }

  function updateRow(id: string, patch: Partial<Pick<SessionRow, 'title' | 'description'>>): void {
    rows.value = rows.value.map(row => row.id === id ? { ...row, ...patch } : row)
    persistRows()
  }

  function removeRow(id: string): void {
    rows.value = rows.value.filter(row => row.id !== id)
    assignments.value = Object.fromEntries(Object.entries(assignments.value).filter(([entryKey]) => !entryKey.startsWith(`${id}:`)))
    persistRows()
    persistAssignments()
  }

  function slotFor(rowId: string, participantId: string): string {
    return assignments.value[key(rowId, participantId)] ?? UNASSIGNED_SLOT
  }

  function participantsInSlot(rowId: string, slotId: string, participantIds: string[]): string[] {
    return participantIds.filter(id => slotFor(rowId, id) === slotId)
  }

  function assign(rowId: string, participantId: string, slotId: string): void {
    const cellKey = key(rowId, participantId)

    assignments.value = slotId === UNASSIGNED_SLOT
      ? Object.fromEntries(Object.entries(assignments.value).filter(([entryKey]) => entryKey !== cellKey))
      : { ...assignments.value, [cellKey]: slotId }

    persistAssignments()
  }

  onMounted(() => {
    rows.value = readRows()
    assignments.value = readAssignments()
    hydrated.value = true

    window.addEventListener('storage', onStorage)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
  })

  function onStorage(event: StorageEvent): void {
    if (event.key === ROWS_KEY) {
      rows.value = readRows()
    }

    if (event.key === ASSIGNMENTS_KEY) {
      assignments.value = readAssignments()
    }
  }

  function readRows(): SessionRow[] {
    const raw = window.localStorage.getItem(ROWS_KEY)

    if (!raw) {
      return []
    }

    try {
      const parsed: unknown = JSON.parse(raw)

      return isRowArray(parsed) ? parsed : []
    } catch {
      return []
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

  function persistRows(): void {
    window.localStorage.setItem(ROWS_KEY, JSON.stringify(rows.value))
  }

  function persistAssignments(): void {
    window.localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments.value))
  }

  return {
    rows,
    hydrated,
    addRow,
    updateRow,
    removeRow,
    slotFor,
    participantsInSlot,
    assign
  }
}

function key(rowId: string, participantId: string): string {
  return `${rowId}:${participantId}`
}

function isAssignments(value: unknown): value is Assignments {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && Object.values(value).every(entry => typeof entry === 'string')
}

function isRowArray(value: unknown): value is SessionRow[] {
  return Array.isArray(value) && value.every(entry =>
    typeof entry === 'object' && entry !== null
    && typeof (entry as SessionRow).id === 'string'
    && typeof (entry as SessionRow).title === 'string'
    && typeof (entry as SessionRow).description === 'string'
  )
}

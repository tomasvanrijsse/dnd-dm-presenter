export interface SessionRow {
  id: string
  title: string
  description: string
}

export interface SessionGroup {
  id: string
  name: string
}

const ROWS_KEY = 'dm-presenter:session-rows'
const ASSIGNMENTS_KEY = 'dm-presenter:session-assignments'
const GROUPS_KEY = 'dm-presenter:session-groups'

export const UNASSIGNED_SLOT = 'unassigned'
export const AWAY_SLOT = 'away'

type Assignments = Record<string, string>

function defaultGroups(): SessionGroup[] {
  return [{ id: 'group-1', name: 'Location 1' }]
}

export function useSessionEvents() {
  const rows = useState<SessionRow[]>('session-rows', () => [])
  const assignments = useState<Assignments>('session-assignments', () => ({}))
  const groups = useState<SessionGroup[]>('session-groups', () => defaultGroups())
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

  function setGroups(newGroups: SessionGroup[]): void {
    const removedIds = groups.value.filter(group => !newGroups.some(newGroup => newGroup.id === group.id)).map(group => group.id)

    groups.value = newGroups
    persistGroups()

    if (removedIds.length) {
      assignments.value = Object.fromEntries(Object.entries(assignments.value).filter(([, slotId]) => !removedIds.includes(slotId)))
      persistAssignments()
    }
  }

  onMounted(() => {
    rows.value = readRows()
    assignments.value = readAssignments()
    groups.value = readGroups()
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

    if (event.key === GROUPS_KEY) {
      groups.value = readGroups()
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

  function readGroups(): SessionGroup[] {
    const raw = window.localStorage.getItem(GROUPS_KEY)

    if (!raw) {
      return defaultGroups()
    }

    try {
      const parsed: unknown = JSON.parse(raw)

      return isGroupArray(parsed) ? parsed : defaultGroups()
    } catch {
      return defaultGroups()
    }
  }

  function persistRows(): void {
    window.localStorage.setItem(ROWS_KEY, JSON.stringify(rows.value))
  }

  function persistAssignments(): void {
    window.localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments.value))
  }

  function persistGroups(): void {
    window.localStorage.setItem(GROUPS_KEY, JSON.stringify(groups.value))
  }

  return {
    rows,
    groups,
    hydrated,
    addRow,
    updateRow,
    removeRow,
    slotFor,
    participantsInSlot,
    assign,
    setGroups
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

function isGroupArray(value: unknown): value is SessionGroup[] {
  return Array.isArray(value) && value.every(entry =>
    typeof entry === 'object' && entry !== null
    && typeof (entry as SessionGroup).id === 'string'
    && typeof (entry as SessionGroup).name === 'string'
  )
}

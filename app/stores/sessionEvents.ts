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

export const useSessionEventsStore = defineStore('session-events', () => {
  const rows = ref<SessionRow[]>([])
  const assignments = ref<Assignments>({})
  const groups = ref<SessionGroup[]>(defaultGroups())

  function addRow(): void {
    rows.value = [...rows.value, { id: crypto.randomUUID(), title: `Round ${rows.value.length + 1}`, description: '' }]
  }

  function updateRow(id: string, patch: Partial<Pick<SessionRow, 'title' | 'description'>>): void {
    rows.value = rows.value.map(row => row.id === id ? { ...row, ...patch } : row)
  }

  function removeRow(id: string): void {
    rows.value = rows.value.filter(row => row.id !== id)
    assignments.value = Object.fromEntries(Object.entries(assignments.value).filter(([entryKey]) => !entryKey.startsWith(`${id}:`)))
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
  }

  function setGroups(newGroups: SessionGroup[]): void {
    const removedIds = groups.value.filter(group => !newGroups.some(newGroup => newGroup.id === group.id)).map(group => group.id)

    groups.value = newGroups

    if (removedIds.length) {
      assignments.value = Object.fromEntries(Object.entries(assignments.value).filter(([, slotId]) => !removedIds.includes(slotId)))
    }
  }

  return {
    rows,
    groups,
    addRow,
    updateRow,
    removeRow,
    slotFor,
    participantsInSlot,
    assign,
    setGroups
  }
}, {
  persist: [
    { key: ROWS_KEY, ...fieldPersistence('rows', isRowArray, () => []) },
    { key: ASSIGNMENTS_KEY, ...fieldPersistence('assignments', isAssignments, () => ({})) },
    { key: GROUPS_KEY, ...fieldPersistence('groups', isGroupArray, defaultGroups) }
  ]
})

function key(rowId: string, participantId: string): string {
  return `${rowId}:${participantId}`
}

function isAssignments(value: unknown): value is Assignments {
  return isRecord(value) && Object.values(value).every(entry => typeof entry === 'string')
}

function isRowArray(value: unknown): value is SessionRow[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.title === 'string'
    && typeof entry.description === 'string'
  )
}

function isGroupArray(value: unknown): value is SessionGroup[] {
  return Array.isArray(value) && value.every(entry =>
    isRecord(entry)
    && typeof entry.id === 'string'
    && typeof entry.name === 'string'
  )
}

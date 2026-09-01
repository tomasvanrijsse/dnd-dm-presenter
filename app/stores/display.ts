const DISPLAYED_KEY = 'dm-presenter:displayed'

export type DisplayedKind = 'item'
export type DisplayMode = 'npc' | DisplayedKind | 'location'

export interface DisplayedEntry {
  kind: DisplayedKind
  id: string
}

interface DisplayState {
  mode: DisplayMode
  displayed: DisplayedEntry[]
}

export const useDisplayStore = defineStore('display', () => {
  const mode = ref<DisplayMode>('npc')
  const displayed = ref<DisplayedEntry[]>([])

  function isDisplayed(kind: DisplayedKind, id: string): boolean {
    return displayed.value.some(entry => entry.kind === kind && entry.id === id)
  }

  function toggleDisplay(kind: DisplayedKind, id: string): void {
    displayed.value = isDisplayed(kind, id)
      ? displayed.value.filter(entry => !(entry.kind === kind && entry.id === id))
      : [...displayed.value, { kind, id }]
  }

  function displayedIds(kind: DisplayedKind): string[] {
    return displayed.value.filter(entry => entry.kind === kind).map(entry => entry.id)
  }

  function setMode(value: DisplayMode): void {
    mode.value = value
  }

  return { mode, displayed, isDisplayed, toggleDisplay, displayedIds, setMode }
}, {
  persist: {
    key: DISPLAYED_KEY,
    serializer: {
      serialize: state => JSON.stringify({ mode: state.mode, displayed: state.displayed }),
      deserialize: (raw) => {
        const parsed: unknown = JSON.parse(raw)

        return sanitizeDisplayState(parsed)
      }
    }
  }
})

function sanitizeDisplayState(value: unknown): DisplayState {
  const mode = isRecord(value) && (value.mode === 'npc' || value.mode === 'item' || value.mode === 'location')
    ? value.mode
    : 'npc'
  const displayed = isRecord(value) && Array.isArray(value.displayed)
    ? value.displayed.filter(isDisplayedEntry)
    : []

  return { mode, displayed }
}

function isDisplayedEntry(value: unknown): value is DisplayedEntry {
  return isRecord(value)
    && (value as { kind?: unknown }).kind === 'item'
    && typeof (value as { id?: unknown }).id === 'string'
}

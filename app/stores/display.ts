const DISPLAYED_KEY = 'dm-presenter:displayed'

export type DisplayedKind = 'item' | 'location'
export type DisplayMode = 'npc' | DisplayedKind

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

        return isDisplayState(parsed) ? parsed : { mode: 'npc', displayed: [] }
      }
    }
  }
})

function isDisplayState(value: unknown): value is DisplayState {
  return isRecord(value)
    && (value.mode === 'npc' || value.mode === 'item' || value.mode === 'location')
    && Array.isArray(value.displayed)
    && value.displayed.every(isDisplayedEntry)
}

function isDisplayedEntry(value: unknown): value is DisplayedEntry {
  return isRecord(value)
    && ((value as { kind?: unknown }).kind === 'item' || (value as { kind?: unknown }).kind === 'location')
    && typeof (value as { id?: unknown }).id === 'string'
}

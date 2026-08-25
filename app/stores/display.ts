const DISPLAYED_KEY = 'dm-presenter:displayed'

export type DisplayedKind = 'item' | 'location'

export interface DisplayedEntry {
  kind: DisplayedKind
  id: string
}

export const useDisplayStore = defineStore('display', () => {
  const displayed = ref<DisplayedEntry | null>(null)

  function isDisplayed(kind: DisplayedKind, id: string): boolean {
    return displayed.value?.kind === kind && displayed.value?.id === id
  }

  function toggleDisplay(kind: DisplayedKind, id: string): void {
    displayed.value = isDisplayed(kind, id) ? null : { kind, id }
  }

  return { displayed, isDisplayed, toggleDisplay }
}, {
  persist: { key: DISPLAYED_KEY, ...fieldPersistence('displayed', isDisplayedEntry, () => null) }
})

function isDisplayedEntry(value: unknown): value is DisplayedEntry | null {
  if (value === null) {
    return true
  }

  return typeof value === 'object' && value !== null
    && ((value as { kind?: unknown }).kind === 'item' || (value as { kind?: unknown }).kind === 'location')
    && typeof (value as { id?: unknown }).id === 'string'
}

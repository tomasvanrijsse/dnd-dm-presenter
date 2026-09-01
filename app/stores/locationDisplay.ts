import type { LocationFogState, Rect } from '~/types/fog'

const LOCATION_DISPLAY_KEY = 'dm-presenter:location-display'

interface LocationDisplayState {
  activeLocationId: string | null
  fog: Record<string, LocationFogState>
}

const EMPTY_FOG_STATE: LocationFogState = { fogEnabled: false, revealedRects: [] }

export const useLocationDisplayStore = defineStore('locationDisplay', () => {
  const activeLocationId = ref<string | null>(null)
  const fog = ref<Record<string, LocationFogState>>({})

  function isActive(id: string): boolean {
    return activeLocationId.value === id
  }

  function showLocation(id: string): void {
    activeLocationId.value = id
  }

  function hideLocation(): void {
    activeLocationId.value = null
  }

  function getFogState(id: string): LocationFogState {
    return fog.value[id] ?? EMPTY_FOG_STATE
  }

  function addFog(id: string): void {
    fog.value = { ...fog.value, [id]: { fogEnabled: true, revealedRects: [] } }
  }

  function clearFog(id: string): void {
    fog.value = { ...fog.value, [id]: { ...getFogState(id), fogEnabled: false } }
  }

  function revealRect(id: string, rect: Rect): void {
    const current = getFogState(id)
    fog.value = { ...fog.value, [id]: { fogEnabled: true, revealedRects: [...current.revealedRects, rect] } }
  }

  return { activeLocationId, fog, isActive, showLocation, hideLocation, getFogState, addFog, clearFog, revealRect }
}, {
  persist: {
    key: LOCATION_DISPLAY_KEY,
    serializer: {
      serialize: state => JSON.stringify({ activeLocationId: state.activeLocationId, fog: state.fog }),
      deserialize: (raw) => {
        const parsed: unknown = JSON.parse(raw)

        return isLocationDisplayState(parsed) ? parsed : { activeLocationId: null, fog: {} }
      }
    }
  }
})

function isLocationDisplayState(value: unknown): value is LocationDisplayState {
  return isRecord(value)
    && (value.activeLocationId === null || typeof value.activeLocationId === 'string')
    && isRecord(value.fog)
    && Object.values(value.fog).every(isLocationFogState)
}

function isLocationFogState(value: unknown): value is LocationFogState {
  return isRecord(value)
    && typeof value.fogEnabled === 'boolean'
    && Array.isArray(value.revealedRects)
    && value.revealedRects.every(isRect)
}

function isRect(value: unknown): value is Rect {
  return isRecord(value)
    && typeof value.x === 'number'
    && typeof value.y === 'number'
    && typeof value.width === 'number'
    && typeof value.height === 'number'
}

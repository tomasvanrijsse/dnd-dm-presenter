import type { Serializer } from 'pinia-plugin-persistedstate'
import type { StateTree } from 'pinia'

export function fieldPersistence<T>(
  field: string,
  isValid: (value: unknown) => value is T,
  fallback: () => T
): { serializer: Serializer } {
  return {
    serializer: {
      serialize: (state: StateTree) => JSON.stringify(state[field]),
      deserialize: (raw: string) => {
        const parsed: unknown = JSON.parse(raw)

        return { [field]: isValid(parsed) ? parsed : fallback() }
      }
    }
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function slugify(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'entry'
}

export function uniqueId(name: string, existing: { id: string }[]): string {
  const base = slugify(name)
  const existingIds = new Set(existing.map(entry => entry.id))

  if (!existingIds.has(base)) {
    return base
  }

  let suffix = 2

  while (existingIds.has(`${base}-${suffix}`)) {
    suffix += 1
  }

  return `${base}-${suffix}`
}

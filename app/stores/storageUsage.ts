const ESTIMATED_LIMIT_BYTES = 5 * 1024 * 1024

export const useStorageUsageStore = defineStore('storage-usage', () => {
  const usedBytes = ref(0)

  function refresh(): void {
    let total = 0

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)

      if (key === null) {
        continue
      }

      total += key.length + (window.localStorage.getItem(key)?.length ?? 0)
    }

    usedBytes.value = total
  }

  return { usedBytes, limitBytes: ESTIMATED_LIMIT_BYTES, refresh }
})

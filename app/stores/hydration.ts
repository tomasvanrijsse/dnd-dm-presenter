export const useHydrationStore = defineStore('hydration', () => {
  const hydrated = ref(false)

  function markHydrated(): void {
    hydrated.value = true
  }

  return { hydrated, markHydrated }
})

<script setup lang="ts">
const npcsStore = useNpcsStore()
const { npcs } = storeToRefs(npcsStore)
const { isFlagSet } = npcsStore

const itemsStore = useItemsStore()
const { items } = storeToRefs(itemsStore)

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)

const displayStore = useDisplayStore()
const { mode } = storeToRefs(displayStore)
const { isDisplayed } = displayStore

const { hydrated } = storeToRefs(useHydrationStore())

const presentNpcs = computed(() => hydrated.value ? npcs.value.filter(npc => !isFlagSet(npc.id, 'away')) : [])
const displayedItems = computed(() => items.value.filter(entry => isDisplayed('item', entry.id)))
const displayedLocations = computed(() => locations.value.filter(entry => isDisplayed('location', entry.id)))

const activeEntries = computed(() => {
  if (mode.value === 'item') {
    return displayedItems.value
  }

  if (mode.value === 'location') {
    return displayedLocations.value
  }

  return presentNpcs.value
})

const columns = computed(() => Math.max(1, Math.ceil(Math.sqrt(activeEntries.value.length))))
const rows = computed(() => Math.max(1, Math.ceil(activeEntries.value.length / columns.value)))

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value}, 1fr)`,
  gridTemplateRows: `repeat(${rows.value}, 1fr)`
}))

useHead({
  title: 'NPC Display',
  htmlAttrs: { style: 'overflow: hidden' },
  bodyAttrs: { style: 'overflow: hidden; margin: 0' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap' }
  ]
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden bg-white mb-8">
    <template v-if="mode === 'npc'">
      <div
        v-if="presentNpcs.length"
        class="grid h-full w-full overflow-hidden"
        :style="gridStyle"
      >
        <div
          v-for="npc in presentNpcs"
          :key="npc.id"
          class="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
        >
          <img
            :src="npc.image"
            :alt="npc.name"
            class="block min-h-0 w-full flex-1 object-contain"
            :class="isFlagSet(npc.id, 'seen') ? '' : 'blur-xl'"
          >

          <div
            v-if="isFlagSet(npc.id, 'introduced')"
            class="tangerine-bold shrink-0 bg-white py-1 text-center text-5xl text-black"
          >
            {{ npc.name }}
          </div>
        </div>
      </div>

      <div
        v-else-if="hydrated"
        class="flex h-full w-full items-center justify-center text-black/40 text-2xl"
      >
        No NPCs present
      </div>
    </template>

    <template v-else>
      <div
        v-if="activeEntries.length"
        class="grid h-full w-full overflow-hidden bg-black"
        :style="gridStyle"
      >
        <div
          v-for="entry in activeEntries"
          :key="entry.id"
          class="flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden"
        >
          <img
            :src="entry.image"
            alt=""
            class="max-h-full max-w-full object-contain"
          >
        </div>
      </div>

      <div
        v-else-if="hydrated"
        class="flex h-full w-full items-center justify-center bg-black text-white/40 text-2xl"
      >
        No {{ mode === 'item' ? 'items' : 'locations' }} displayed
      </div>
    </template>
  </div>
</template>

<style scoped>
.tangerine-regular {
  font-family: "Tangerine", cursive;
  font-weight: 400;
  font-style: normal;
}

.tangerine-bold {
  font-family: "Tangerine", cursive;
  font-weight: 700;
  font-style: normal;
}
</style>

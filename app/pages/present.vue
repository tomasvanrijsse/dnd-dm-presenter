<script setup lang="ts">
const npcsStore = useNpcsStore()
const { npcs } = storeToRefs(npcsStore)

const pointsStore = usePointsStore()
const { isAway, isIntroduced, isSeen } = pointsStore

const itemsStore = useItemsStore()
const { items } = storeToRefs(itemsStore)

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)

const displayStore = useDisplayStore()
const { displayed } = storeToRefs(displayStore)

const { hydrated } = storeToRefs(useHydrationStore())

const displayedImage = computed(() => {
  if (!displayed.value) {
    return null
  }

  const list = displayed.value.kind === 'item' ? items.value : locations.value

  return list.find(entry => entry.id === displayed.value?.id)?.image ?? null
})

const presentNpcs = computed(() => hydrated.value ? npcs.value.filter(npc => !isAway(npc.id)) : [])

const columns = computed(() => Math.max(1, Math.ceil(Math.sqrt(presentNpcs.value.length))))
const rows = computed(() => Math.max(1, Math.ceil(presentNpcs.value.length / columns.value)))

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
    <div
      v-if="displayedImage"
      class="flex h-full w-full items-center justify-center bg-black"
    >
      <img
        :src="displayedImage"
        alt=""
        class="max-h-full max-w-full object-contain"
      >
    </div>

    <div
      v-else-if="presentNpcs.length"
      class="grid h-full w-full overflow-hidden"
      :style="{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }"
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
          :class="isSeen(npc.id) ? '' : 'blur-xl'"
        >

        <div
          v-if="isIntroduced(npc.id)"
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

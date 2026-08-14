<script setup lang="ts">
import { npcs } from '~/data/npcs'

const { hydrated, isAway } = useAdmirationGrid()

const presentNpcs = computed(() => hydrated.value ? npcs.filter(npc => !isAway(npc.id)) : [])

const columns = computed(() => Math.max(1, Math.ceil(Math.sqrt(presentNpcs.value.length))))
const rows = computed(() => Math.max(1, Math.ceil(presentNpcs.value.length / columns.value)))

useHead({
  title: 'NPC Display',
  htmlAttrs: { style: 'overflow: hidden' },
  bodyAttrs: { style: 'overflow: hidden; margin: 0' }
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden bg-black">
    <div
      v-if="presentNpcs.length"
      class="grid h-full w-full overflow-hidden"
      :style="{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }"
    >
      <img
        v-for="npc in presentNpcs"
        :key="npc.id"
        :src="npc.image"
        :alt="npc.name"
        class="block h-full w-full min-h-0 min-w-0 object-cover"
      >
    </div>

    <div
      v-else-if="hydrated"
      class="flex h-full w-full items-center justify-center text-white/40 text-2xl"
    >
      No NPCs present
    </div>
  </div>
</template>

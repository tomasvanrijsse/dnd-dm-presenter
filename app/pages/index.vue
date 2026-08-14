<script setup lang="ts">
import { npcs } from '~/data/npcs'
import { players } from '~/data/players'

const {
  hydrated,
  pointsFor,
  adjust,
  isAway,
  toggleAway,
  allAway,
  toggleAwayForAll,
  isIntroduced,
  toggleIntroduced,
  reset
} = useAdmirationGrid()

const npcIds = npcs.map(npc => npc.id)

const everyoneAway = computed(() => hydrated.value && allAway(npcIds))

const resetOpen = ref(false)

function confirmReset() {
  reset()
  resetOpen.value = false
}

function pointsClass(value: number): string {
  if (value > 0) {
    return 'text-primary'
  }

  if (value < 0) {
    return 'text-error'
  }

  return 'text-dimmed'
}
</script>

<template>
  <UContainer class="py-8">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">
          Admiration Matrix
        </h1>
        <p class="text-sm text-muted">
          Admiration points each NPC holds for each player. Send an NPC away to lock their row. Saved in this browser,
          synced across windows.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          to="/present"
          target="_blank"
          color="neutral"
          variant="subtle"
          icon="i-lucide-monitor"
        >
          Open display
        </UButton>

        <UButton
          color="neutral"
          variant="subtle"
          :icon="everyoneAway ? 'i-lucide-user-check' : 'i-lucide-user-x'"
          @click="toggleAwayForAll(npcIds)"
        >
          {{ everyoneAway ? 'Bring everyone back' : 'Send everyone away' }}
        </UButton>

        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide-rotate-ccw"
          @click="resetOpen = true"
        >
          Reset all
        </UButton>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg ring ring-default bg-default">
      <table class="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col class="w-[26rem]">
          <col
            v-for="player in players"
            :key="player.id"
            class="w-40"
          >
        </colgroup>

        <thead>
          <tr class="border-b border-default bg-elevated/50">
            <th class="sticky left-0 z-10 bg-elevated px-4 py-3 text-left font-semibold text-highlighted">
              NPC
            </th>
            <th
              v-for="player in players"
              :key="player.id"
              class="px-4 py-3 text-center font-semibold text-highlighted"
            >
              {{ player.name }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="npc in npcs"
            :key="npc.id"
            class="border-b border-default last:border-b-0 hover:bg-elevated/30"
            :class="hydrated && isAway(npc.id) ? 'bg-elevated/20' : ''"
          >
            <th class="sticky left-0 z-10 bg-default px-4 py-2 text-left font-medium">
              <div class="flex items-center gap-3">
                <UAvatar
                  :src="npc.image"
                  :alt="npc.name"
                  size="lg"
                  class="shrink-0"
                  :class="hydrated && isAway(npc.id) ? 'grayscale opacity-50' : ''"
                />
                <span
                  class="truncate"
                  :class="hydrated && isAway(npc.id) ? 'text-dimmed line-through' : 'text-highlighted'"
                >
                  {{ npc.name }}
                </span>

                <UBadge
                  v-if="hydrated && isAway(npc.id)"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="shrink-0"
                >
                  Away
                </UBadge>

                <div class="ml-auto flex shrink-0 items-center gap-3">
                  <USwitch
                    :model-value="hydrated && isIntroduced(npc.id)"
                    label="Introduced"
                    size="sm"
                    :aria-label="`Toggle whether ${npc.name} has been introduced`"
                    @update:model-value="toggleIntroduced(npc.id)"
                  />

                  <UButton
                    :icon="hydrated && isAway(npc.id) ? 'i-lucide-user-check' : 'i-lucide-user-x'"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :aria-label="hydrated && isAway(npc.id) ? `Bring ${npc.name} back` : `Send ${npc.name} away`"
                    @click="toggleAway(npc.id)"
                  />
                </div>
              </div>
            </th>

            <td
              v-for="player in players"
              :key="player.id"
              class="px-2 py-2 text-center"
            >
              <div class="flex items-center justify-center gap-1">
                <UButton
                  icon="i-lucide-minus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :class="hydrated && isAway(npc.id) ? 'invisible' : ''"
                  :aria-label="`Lower ${npc.name} admiration for ${player.name}`"
                  @click="adjust(npc.id, player.id, -1)"
                />
                <span
                  class="w-8 text-base font-semibold tabular-nums"
                  :class="hydrated && isAway(npc.id) ? 'text-dimmed' : pointsClass(pointsFor(npc.id, player.id))"
                >
                  {{ hydrated ? pointsFor(npc.id, player.id) : '–' }}
                </span>
                <UButton
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :class="hydrated && isAway(npc.id) ? 'invisible' : ''"
                  :aria-label="`Raise ${npc.name} admiration for ${player.name}`"
                  @click="adjust(npc.id, player.id, 1)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UModal
      v-model:open="resetOpen"
      title="Reset all admiration points?"
      description="Every cell goes back to 0. This cannot be undone."
    >
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            @click="resetOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="confirmReset"
          >
            Reset
          </UButton>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

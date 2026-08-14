<script setup lang="ts">
import { npcs } from '~/data/npcs'
import { players } from '~/data/players'

const { hydrated, pointsFor, adjust, totalForPlayer, totalForNpc, reset } = useAdmirationGrid()

const npcIds = npcs.map(npc => npc.id)
const playerIds = players.map(player => player.id)

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
          Admiration points each NPC holds for each player. Saved in this browser, synced across windows.
        </p>
      </div>

      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-rotate-ccw"
        @click="resetOpen = true"
      >
        Reset all
      </UButton>
    </div>

    <div class="overflow-x-auto rounded-lg ring ring-default bg-default">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b border-default bg-elevated/50">
            <th class="sticky left-0 z-10 bg-elevated px-4 py-3 text-left font-semibold text-highlighted">
              NPC
            </th>
            <th
              v-for="player in players"
              :key="player.id"
              class="px-4 py-3 text-center font-semibold text-highlighted min-w-32"
            >
              {{ player.name }}
            </th>
            <th class="px-4 py-3 text-center font-semibold text-muted min-w-20">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="npc in npcs"
            :key="npc.id"
            class="border-b border-default last:border-b-0 hover:bg-elevated/30"
          >
            <th class="sticky left-0 z-10 bg-default px-4 py-2 text-left font-medium">
              <div class="flex items-center gap-3">
                <UAvatar
                  :src="npc.image"
                  :alt="npc.name"
                  size="lg"
                />
                <span class="text-highlighted whitespace-nowrap">{{ npc.name }}</span>
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
                  :aria-label="`Lower ${npc.name} admiration for ${player.name}`"
                  @click="adjust(npc.id, player.id, -1)"
                />
                <span
                  class="w-8 text-base font-semibold tabular-nums"
                  :class="pointsClass(pointsFor(npc.id, player.id))"
                >
                  {{ hydrated ? pointsFor(npc.id, player.id) : '–' }}
                </span>
                <UButton
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :aria-label="`Raise ${npc.name} admiration for ${player.name}`"
                  @click="adjust(npc.id, player.id, 1)"
                />
              </div>
            </td>

            <td class="px-4 py-2 text-center font-semibold tabular-nums text-muted">
              {{ hydrated ? totalForNpc(npc.id, playerIds) : '–' }}
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr class="border-t border-default bg-elevated/50">
            <th class="sticky left-0 z-10 bg-elevated px-4 py-3 text-left font-semibold text-highlighted">
              Total
            </th>
            <td
              v-for="player in players"
              :key="player.id"
              class="px-4 py-3 text-center text-base font-bold tabular-nums"
              :class="pointsClass(totalForPlayer(player.id, npcIds))"
            >
              {{ hydrated ? totalForPlayer(player.id, npcIds) : '–' }}
            </td>
            <td />
          </tr>
        </tfoot>
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

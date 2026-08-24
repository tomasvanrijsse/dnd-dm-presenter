<script setup lang="ts">
import type { Npc } from '~/types/cast'

const { npcs, hydrated: npcsHydrated, removeNpc } = useNpcs()
const { players, hydrated: playersHydrated } = usePlayers()

const {
  hydrated: pointsHydrated,
  pointsFor,
  adjust,
  isAway,
  toggleAway,
  allAway,
  toggleAwayForAll,
  isIntroduced,
  toggleIntroduced,
  reset
} = usePoints()

const hydrated = computed(() => npcsHydrated.value && playersHydrated.value && pointsHydrated.value)

const npcIds = computed(() => npcs.value.map(npc => npc.id))

const everyoneAway = computed(() => hydrated.value && allAway(npcIds.value))

const resetOpen = ref(false)

function confirmReset() {
  reset()
  resetOpen.value = false
}

const infoNpc = ref<Npc | null>(null)

const npcFormOpen = ref(false)
const editingNpc = ref<Npc | null>(null)

function openNewNpc(): void {
  editingNpc.value = null
  npcFormOpen.value = true
}

function editNpcFromView(npc: Npc): void {
  infoNpc.value = null
  editingNpc.value = npc
  npcFormOpen.value = true
}

const npcDeleteTarget = ref<Npc | null>(null)

function requestDeleteNpc(npc: Npc): void {
  infoNpc.value = null
  npcDeleteTarget.value = npc
}

function confirmRemoveNpc(): void {
  if (npcDeleteTarget.value) {
    removeNpc(npcDeleteTarget.value.id)
  }

  npcDeleteTarget.value = null
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
          Points
        </h1>
        <p class="text-sm text-muted">
          Points each NPC holds for each player. Send an NPC away to lock their row. Saved in this browser,
          synced across windows.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide-plus"
          @click="openNewNpc"
        >
          Add NPC
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
      <div
        v-if="!hydrated"
        class="p-8 text-center text-sm text-muted"
      >
        Loading points…
      </div>

      <div
        v-else-if="!npcs.length || !players.length"
        class="p-8 text-center text-sm text-muted"
      >
        No NPCs or players yet. Add them on the
        <ULink to="/admin">
          admin
        </ULink>
        page.
      </div>

      <table
        v-else
        class="w-full table-fixed border-collapse text-sm"
      >
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
              <div class="flex items-center justify-between gap-3">
                NPC

                <UButton
                  color="neutral"
                  variant="subtle"
                  size="xs"
                  :icon="everyoneAway ? 'i-lucide-user-check' : 'i-lucide-user-x'"
                  @click="toggleAwayForAll(npcIds)"
                >
                  {{ everyoneAway ? 'Bring everyone back' : 'Send everyone away' }}
                </UButton>
              </div>
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
            :class="isAway(npc.id) ? 'bg-elevated/20' : ''"
          >
            <th class="sticky left-0 z-10 bg-default px-4 py-2 text-left font-medium">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="flex min-w-0 items-center gap-3 rounded hover:opacity-75"
                  :aria-label="`View info for ${npc.name}`"
                  @click="infoNpc = npc"
                >
                  <UAvatar
                    :src="npc.image"
                    :alt="npc.name"
                    size="lg"
                    class="shrink-0"
                    :class="isAway(npc.id) ? 'grayscale opacity-50' : ''"
                  />
                  <span
                    class="truncate"
                    :class="isAway(npc.id) ? 'text-dimmed line-through' : 'text-highlighted'"
                  >
                    {{ npc.name }}
                  </span>
                </button>

                <div class="ml-auto flex shrink-0 items-center gap-3">
                  <UButton
                    :icon="'i-lucide-handshake'"
                    :color="isIntroduced(npc.id) ? 'primary' : 'neutral'"
                    :variant="isIntroduced(npc.id) ? 'solid' : 'ghost'"
                    size="xs"
                    :aria-label="`Toggle whether ${npc.name} has been introduced`"
                    @click="toggleIntroduced(npc.id)"
                  />

                  <USwitch
                    :model-value="!isAway(npc.id)"
                    :label="isAway(npc.id) ? 'Away' : 'Present'"
                    :ui="{ label: 'w-16' }"
                    size="sm"
                    :aria-label="`Toggle whether ${npc.name} is present`"
                    @update:model-value="toggleAway(npc.id)"
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
                  :aria-label="`Lower ${npc.name} points for ${player.name}`"
                  @click="adjust(npc.id, player.id, -1)"
                />
                <span
                  class="w-8 text-base font-semibold tabular-nums"
                  :class="pointsClass(pointsFor(npc.id, player.id))"
                >
                  {{ pointsFor(npc.id, player.id) }}
                </span>
                <UButton
                  icon="i-lucide-plus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :aria-label="`Raise ${npc.name} points for ${player.name}`"
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
      title="Reset all points?"
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

    <NpcFormModal
      v-model:open="npcFormOpen"
      :npc="editingNpc"
    />

    <NpcViewModal
      :npc="infoNpc"
      @close="infoNpc = null"
      @edit="editNpcFromView"
      @delete="requestDeleteNpc"
    />

    <UModal
      :open="npcDeleteTarget !== null"
      title="Remove NPC?"
      :description="npcDeleteTarget ? `${npcDeleteTarget.name} will be removed. This cannot be undone.` : ''"
      @update:open="value => { if (!value) npcDeleteTarget = null }"
    >
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            @click="npcDeleteTarget = null"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="confirmRemoveNpc"
          >
            Remove
          </UButton>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import type { Npc } from '~/types/cast'

const npcsStore = useNpcsStore()
const { npcs } = storeToRefs(npcsStore)
const {
  removeNpc,
  isFlagSet,
  toggleFlag,
  allAway,
  toggleAwayForAll
} = npcsStore

const playersStore = usePlayersStore()
const { players } = storeToRefs(playersStore)

const itemsStore = useItemsStore()
const { items } = storeToRefs(itemsStore)
const { addItem, removeItem, reorderItems } = itemsStore

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)
const { addLocation, removeLocation, reorderLocations } = locationsStore

const npcsTableBody = ref<HTMLElement | null>(null)

useSortable(npcsTableBody, npcs, {
  handle: '.drag-handle',
  animation: 150,
  watchElement: true
})

const displayStore = useDisplayStore()
const { mode } = storeToRefs(displayStore)
const { setMode } = displayStore

const pointsStore = usePointsStore()
const { pointsFor, adjust, reset } = pointsStore

const { hydrated } = storeToRefs(useHydrationStore())

const baseURL = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
const miniViewerOpen = ref(true)

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

async function onAddItem(file: File): Promise<void> {
  addItem(await convertImageFileToWebp(file))
}

async function onAddLocation(file: File): Promise<void> {
  addLocation(await convertImageFileToWebp(file))
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
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-highlighted">
            NPCs & player points
          </h1>
          <UButton
            :color="mode === 'npc' ? 'error' : 'neutral'"
            :variant="mode === 'npc' ? 'solid' : 'subtle'"
            icon="i-lucide-monitor"
            size="xs"
            @click="setMode('npc')"
          >
            Live presenting
          </UButton>
        </div>
        <p class="text-sm text-muted">
          Show the name and/or image of the NPC to the players. And track the points each NPC holds for each player.
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
          v-if="players.length > 0"
          color="neutral"
          variant="subtle"
          icon="i-lucide-rotate-ccw"
          @click="resetOpen = true"
        >
          Reset points
        </UButton>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg ring ring-default bg-default">
      <div
        v-if="!hydrated"
        class="p-8 text-center text-sm text-muted"
      >
        Loading NPCs…
      </div>

      <div
        v-else-if="!npcs.length"
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

        <tbody ref="npcsTableBody">
          <tr
            v-for="npc in npcs"
            :key="npc.id"
            class="border-b border-default last:border-b-0 hover:bg-elevated/30"
            :class="isFlagSet(npc.id, 'away') ? 'bg-elevated/20' : ''"
          >
            <th class="sticky left-0 z-10 bg-default px-4 py-2 text-left font-medium">
              <div class="flex items-center gap-3">
                <div
                  class="drag-handle shrink-0 cursor-grab text-dimmed hover:text-highlighted active:cursor-grabbing"
                  :aria-label="`Drag to reorder ${npc.name}`"
                >
                  <UIcon
                    name="i-lucide-grip-vertical"
                    class="size-4"
                  />
                </div>

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
                    :class="isFlagSet(npc.id, 'away') ? 'grayscale opacity-50' : ''"
                  />
                  <span
                    class="truncate"
                    :class="isFlagSet(npc.id, 'away') ? 'text-dimmed line-through' : 'text-highlighted'"
                  >
                    {{ npc.name }}
                  </span>
                </button>

                <div class="ml-auto flex shrink-0 items-center gap-3">
                  <UTooltip :text="`Toggle whether ${npc.name}'s name is known`">
                    <UButton
                      :icon="'i-lucide-handshake'"
                      :color="isFlagSet(npc.id, 'introduced') ? 'primary' : 'neutral'"
                      :variant="isFlagSet(npc.id, 'introduced') ? 'solid' : 'ghost'"
                      size="xs"
                      :aria-label="`Toggle whether ${npc.name}'s name is known`"
                      @click="toggleFlag(npc.id, 'introduced')"
                    />
                  </UTooltip>

                  <UTooltip :text="`Toggle whether ${npc.name} has been seen`">
                    <UButton
                      :icon="'i-lucide-eye'"
                      :color="isFlagSet(npc.id, 'seen') ? 'primary' : 'neutral'"
                      :variant="isFlagSet(npc.id, 'seen') ? 'solid' : 'ghost'"
                      size="xs"
                      :aria-label="`Toggle whether ${npc.name} has been seen`"
                      @click="toggleFlag(npc.id, 'seen')"
                    />
                  </UTooltip>

                  <USwitch
                    :model-value="!isFlagSet(npc.id, 'away')"
                    :label="isFlagSet(npc.id, 'away') ? 'Away' : 'Present'"
                    :ui="{ label: 'w-16' }"
                    size="sm"
                    :aria-label="`Toggle whether ${npc.name} is present`"
                    @update:model-value="toggleFlag(npc.id, 'away')"
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

    <div class="mt-8 flex flex-col gap-8">
      <GalleryGrid
        title="Items"
        add-label="Add item"
        kind="item"
        :images="items"
        @add="onAddItem"
        @remove="removeItem"
        @reorder="reorderItems"
      />

      <GalleryGrid
        title="Locations"
        add-label="Add location"
        kind="location"
        :images="locations"
        @add="onAddLocation"
        @remove="removeLocation"
        @reorder="reorderLocations"
      />
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

    <div class="fixed bottom-4 right-4 z-50 w-72 overflow-hidden rounded-lg shadow-xl ring ring-default bg-default">
      <div class="flex items-center justify-between gap-2 bg-elevated px-3 py-1.5">
        <span class="text-xs font-medium text-highlighted">Player view</span>

        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-external-link"
            color="neutral"
            variant="ghost"
            size="xs"
            :to="`${baseURL}/present`"
            target="_blank"
            aria-label="Open full player view"
          />
          <UButton
            :icon="miniViewerOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="miniViewerOpen ? 'Collapse player view preview' : 'Expand player view preview'"
            @click="miniViewerOpen = !miniViewerOpen"
          />
        </div>
      </div>

      <div
        v-show="miniViewerOpen"
        class="aspect-video w-full bg-black"
      >
        <PresentView />
      </div>
    </div>
  </UContainer>
</template>

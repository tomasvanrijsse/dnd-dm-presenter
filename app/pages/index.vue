<script setup lang="ts">
import type { Npc } from '~/data/npcs'
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

const infoNpc = ref<Npc | null>(null)

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
      <div
        v-if="!hydrated"
        class="p-8 text-center text-sm text-muted"
      >
        Loading admiration grid…
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

                <UBadge
                  v-if="isAway(npc.id)"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="shrink-0"
                >
                  Away
                </UBadge>

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
                    :model-value="isAway(npc.id)"
                    label="Away"
                    size="sm"
                    :aria-label="`Toggle whether ${npc.name} is away`"
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
                  :aria-label="`Lower ${npc.name} admiration for ${player.name}`"
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

    <UModal
      :open="infoNpc !== null"
      :title="infoNpc?.name"
      :description="infoNpc?.info.role"
      :ui="{ content: 'sm:max-w-2xl' }"
      @update:open="value => { if (!value) infoNpc = null }"
    >
      <template #body>
        <div
          v-if="infoNpc"
          class="flex flex-col gap-4"
        >
          <div class="flex items-start gap-4">
            <UAvatar
              :src="infoNpc.image"
              :alt="infoNpc.name"
              size="3xl"
              class="shrink-0"
            />
            <p class="text-sm text-muted">
              {{ infoNpc.info.appearance }}
            </p>
          </div>

          <p class="text-sm text-muted">
            <span class="font-semibold text-highlighted">Gear:</span> {{ infoNpc.info.gear }}
          </p>

          <div class="grid grid-cols-1 gap-2 rounded-lg bg-elevated/50 p-3 text-sm sm:grid-cols-2">
            <p><span class="font-semibold text-highlighted">Trait:</span> {{ infoNpc.info.trait }}</p>
            <p><span class="font-semibold text-highlighted">Ideal:</span> {{ infoNpc.info.ideal }}</p>
            <p><span class="font-semibold text-highlighted">Bond:</span> {{ infoNpc.info.bond }}</p>
            <p><span class="font-semibold text-highlighted">Flaw:</span> {{ infoNpc.info.flaw }}</p>
          </div>

          <div
            v-for="section in infoNpc.info.sections"
            :key="section.title"
          >
            <h3 class="mb-1 font-semibold text-highlighted">
              {{ section.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ section.body }}
            </p>
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

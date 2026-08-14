<script setup lang="ts">
import { dances } from '~/data/dances'
import { npcs } from '~/data/npcs'
import { players } from '~/data/players'
import { AWAY_SLOT, COUPLE_SLOTS, DANCING_ROUNDS, NOT_DANCING_SLOT, useDancingRounds } from '~/composables/useDancingRounds'

const { hydrated, participantsInSlot, assign } = useDancingRounds()

const participants = computed(() => [
  ...players.map(player => ({ id: player.id, name: player.name })),
  ...npcs.filter(npc => npc.id !== 'dizzy-the-dragon').map(npc => ({ id: npc.id, name: npc.name.split(' ')[0] }))
])

const participantIds = computed(() => participants.value.map(participant => participant.id))

const rounds = Array.from({ length: DANCING_ROUNDS }, (_, index) => index + 1)

function nameFor(participantId: string): string {
  return participants.value.find(participant => participant.id === participantId)?.name ?? participantId
}

function danceFor(round: number) {
  return dances.find(dance => dance.round === round)
}

function slotLabel(slotId: string): string {
  if (slotId === NOT_DANCING_SLOT) {
    return 'Available'
  }

  if (slotId === AWAY_SLOT) {
    return 'Away'
  }

  return `Couple ${slotId.replace('couple-', '')}`
}

function onDragStart(event: DragEvent, round: number, participantId: string): void {
  event.dataTransfer?.setData('text/plain', JSON.stringify({ round, participantId }))
}

function onDrop(event: DragEvent, round: number, slotId: string): void {
  const raw = event.dataTransfer?.getData('text/plain')

  if (!raw) {
    return
  }

  const data = JSON.parse(raw) as { round: number, participantId: string }

  if (data.round !== round) {
    return
  }

  if (slotId !== NOT_DANCING_SLOT && slotId !== AWAY_SLOT) {
    const occupants = participantsInSlot(round, slotId, participantIds.value)

    if (occupants.length >= 2 && !occupants.includes(data.participantId)) {
      return
    }
  }

  assign(round, data.participantId, slotId)
}
</script>

<template>
  <div class="w-full px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-highlighted">
        The Dancing
      </h1>
      <p class="text-sm text-muted">
        Nine rounds of dancing. Drag names from Available into a couple's column, or Away. Saved in this browser,
        synced across windows.
      </p>
    </div>

    <div
      v-if="hydrated"
      class="overflow-x-auto rounded-lg ring ring-default bg-default"
    >
      <table class="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col class="w-[14%]">
          <col class="w-[16%]">
          <col
            v-for="slotId in COUPLE_SLOTS"
            :key="slotId"
            class="w-[10%]"
          >
          <col class="w-[14%]">
        </colgroup>

        <thead>
          <tr class="border-b border-default bg-elevated/50">
            <th class="px-4 py-3 text-left font-semibold text-highlighted">
              Round
            </th>
            <th class="px-4 py-3 text-left font-semibold text-highlighted">
              {{ slotLabel(NOT_DANCING_SLOT) }}
            </th>
            <th
              v-for="slotId in COUPLE_SLOTS"
              :key="slotId"
              class="px-4 py-3 text-left font-semibold text-highlighted"
            >
              {{ slotLabel(slotId) }}
            </th>
            <th class="px-4 py-3 text-left font-semibold text-highlighted">
              {{ slotLabel(AWAY_SLOT) }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="round in rounds"
            :key="round"
            class="border-b border-default last:border-b-0"
          >
            <td class="px-4 py-2 align-top">
              <div class="font-medium text-highlighted">
                {{ round }}. {{ danceFor(round)?.name }}
              </div>
              <a
                v-if="danceFor(round)"
                :href="danceFor(round)?.spotifyUrl"
                target="_blank"
                rel="noopener"
                class="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <UIcon
                  name="i-simple-icons-spotify"
                  class="size-3.5"
                />
                Spotify
              </a>
            </td>

            <td
              class="min-h-16 px-2 py-2 align-top"
              @dragover.prevent
              @drop="onDrop($event, round, NOT_DANCING_SLOT)"
            >
              <div class="flex flex-wrap gap-1">
                <div
                  v-for="participantId in participantsInSlot(round, NOT_DANCING_SLOT, participantIds)"
                  :key="participantId"
                  draggable="true"
                  class="cursor-grab select-none whitespace-nowrap rounded-full bg-elevated px-2 py-1 text-xs text-highlighted active:cursor-grabbing"
                  @dragstart="onDragStart($event, round, participantId)"
                >
                  {{ nameFor(participantId) }}
                </div>
              </div>
            </td>

            <td
              v-for="slotId in COUPLE_SLOTS"
              :key="slotId"
              class="min-h-16 min-w-0 px-2 py-2 align-top"
              @dragover.prevent
              @drop="onDrop($event, round, slotId)"
            >
              <div class="flex min-h-8 flex-wrap gap-1 rounded-md ring-1 ring-dashed ring-default p-1">
                <div
                  v-for="participantId in participantsInSlot(round, slotId, participantIds)"
                  :key="participantId"
                  draggable="true"
                  class="cursor-grab select-none whitespace-nowrap rounded-full bg-primary/15 px-2 py-1 text-xs text-primary active:cursor-grabbing"
                  @dragstart="onDragStart($event, round, participantId)"
                >
                  {{ nameFor(participantId) }}
                </div>
              </div>
            </td>

            <td
              class="min-h-16 px-2 py-2 align-top"
              @dragover.prevent
              @drop="onDrop($event, round, AWAY_SLOT)"
            >
              <div class="flex flex-wrap gap-1">
                <div
                  v-for="participantId in participantsInSlot(round, AWAY_SLOT, participantIds)"
                  :key="participantId"
                  draggable="true"
                  class="cursor-grab select-none whitespace-nowrap rounded-full bg-elevated px-2 py-1 text-xs text-dimmed active:cursor-grabbing"
                  @dragstart="onDragStart($event, round, participantId)"
                >
                  {{ nameFor(participantId) }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

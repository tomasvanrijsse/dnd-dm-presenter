<script setup lang="ts">
import type { DisplayedKind } from '~/stores/display'
import type { GalleryImage } from '~/types/cast'

defineProps<{
  title: string
  addLabel: string
  kind: DisplayedKind
  images: GalleryImage[]
}>()

const emit = defineEmits<{
  add: [file: File]
  remove: [id: string]
}>()

const displayStore = useDisplayStore()
const { mode } = storeToRefs(displayStore)
const { isDisplayed, toggleDisplay, setMode } = displayStore
const { hydrated } = storeToRefs(useHydrationStore())

const fileInput = ref<HTMLInputElement | null>(null)

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    emit('add', file)
  }

  input.value = ''
}

const deleteTarget = ref<GalleryImage | null>(null)

function confirmRemove(): void {
  if (deleteTarget.value) {
    emit('remove', deleteTarget.value.id)
  }

  deleteTarget.value = null
}
</script>

<template>
  <section>
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-semibold text-highlighted">
          {{ title }}
        </h2>
        <UButton
          :color="mode === kind ? 'error' : 'neutral'"
          :variant="mode === kind ? 'solid' : 'subtle'"
          icon="i-lucide-monitor"
          size="xs"
          @click="setMode(kind)"
        >
          Live presenting
        </UButton>
      </div>
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="subtle"
        @click="fileInput?.click()"
      >
        {{ addLabel }}
      </UButton>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      >
    </div>

    <div class="overflow-x-auto rounded-lg ring ring-default bg-default">
      <div
        v-if="!hydrated"
        class="p-8 text-center text-sm text-muted"
      >
        Loading {{ title.toLowerCase() }}…
      </div>

      <div
        v-else-if="!images.length"
        class="p-8 text-center text-sm text-muted"
      >
        No {{ title.toLowerCase() }} yet.
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          v-for="entry in images"
          :key="entry.id"
          class="group relative aspect-square overflow-hidden rounded-lg ring ring-default"
        >
          <img
            :src="entry.image"
            alt=""
            class="h-full w-full object-cover"
          >

          <USwitch
            :model-value="isDisplayed(kind, entry.id)"
            :label="isDisplayed(kind, entry.id) ? 'Shown' : 'Hidden'"
            :ui="{ label: 'w-14 text-white' }"
            size="sm"
            class="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-1"
            :aria-label="`Toggle whether this ${title.toLowerCase().replace(/s$/, '')} is displayed`"
            @update:model-value="toggleDisplay(kind, entry.id)"
          />

          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="solid"
            size="xs"
            class="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
            :aria-label="`Delete ${title.toLowerCase()} image`"
            @click="deleteTarget = entry"
          />
        </div>
      </div>
    </div>

    <UModal
      :open="deleteTarget !== null"
      title="Remove image?"
      :description="`This image will be removed from ${title.toLowerCase()}. This cannot be undone.`"
      @update:open="value => { if (!value) deleteTarget = null }"
    >
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            @click="deleteTarget = null"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="confirmRemove"
          >
            Remove
          </UButton>
        </div>
      </template>
    </UModal>
  </section>
</template>

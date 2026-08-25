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

const { isDisplayed, toggleDisplay } = useDisplayStore()
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
      <h2 class="text-lg font-semibold text-highlighted">
        {{ title }}
      </h2>
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

          <div
            class="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
            @click="toggleDisplay(kind, entry.id)"
          >
            <UButton
              icon="i-lucide-monitor"
              :color="isDisplayed(kind, entry.id) ? 'primary' : 'neutral'"
              :variant="isDisplayed(kind, entry.id) ? 'solid' : 'subtle'"
            >
              {{ isDisplayed(kind, entry.id) ? 'Hide' : 'Display' }}
            </UButton>
          </div>

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

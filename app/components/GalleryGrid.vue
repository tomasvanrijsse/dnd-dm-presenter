<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import type { DisplayMode } from '~/stores/display'
import type { GalleryImage } from '~/types/cast'

const props = defineProps<{
  title: string
  addLabel: string
  kind: DisplayMode & ('item' | 'location')
  images: GalleryImage[]
}>()

const emit = defineEmits<{
  add: [file: File, name?: string]
  remove: [id: string]
  rename: [id: string, name: string]
  reorder: [orderedIds: string[]]
}>()

const displayStore = useDisplayStore()
const { mode } = storeToRefs(displayStore)
const { isDisplayed, toggleDisplay, setMode } = displayStore
const { hydrated } = storeToRefs(useHydrationStore())

const locationDisplayStore = useLocationDisplayStore()
const { isActive: isLocationActive, showLocation, hideLocation } = locationDisplayStore

function toggleLocationDisplay(id: string): void {
  if (isLocationActive(id)) {
    hideLocation()
  } else {
    showLocation(id)
  }
}

const displayTarget = ref<GalleryImage | null>(null)

const sortableImages = ref<GalleryImage[]>([...props.images])

watch(() => props.images, (value) => {
  sortableImages.value = [...value]
})

const gridEl = ref<HTMLElement | null>(null)

useSortable(gridEl, sortableImages, {
  handle: '.drag-handle',
  animation: 150,
  watchElement: true,
  onEnd: async () => {
    await nextTick()
    emit('reorder', sortableImages.value.map(entry => entry.id))
  }
})

const fileInput = ref<HTMLInputElement | null>(null)

const nameModalOpen = ref(false)
const nameInput = ref('')
const pendingFile = ref<File | null>(null)
const renameTargetId = ref<string | null>(null)

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    if (props.kind === 'item') {
      pendingFile.value = file
      renameTargetId.value = null
      nameInput.value = ''
      nameModalOpen.value = true
    } else {
      emit('add', file)
    }
  }

  input.value = ''
}

function openRename(entry: GalleryImage): void {
  pendingFile.value = null
  renameTargetId.value = entry.id
  nameInput.value = entry.name ?? ''
  nameModalOpen.value = true
}

function confirmName(): void {
  const name = nameInput.value.trim()

  if (pendingFile.value) {
    emit('add', pendingFile.value, name)
  } else if (renameTargetId.value) {
    emit('rename', renameTargetId.value, name)
  }

  closeNameModal()
}

function closeNameModal(): void {
  nameModalOpen.value = false
  pendingFile.value = null
  renameTargetId.value = null
  nameInput.value = ''
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
        ref="gridEl"
        class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        <div
          v-for="entry in sortableImages"
          :key="entry.id"
          class="group relative aspect-square overflow-hidden rounded-lg ring ring-default"
        >
          <img
            :src="entry.image"
            alt=""
            class="h-full w-full object-cover"
          >

          <USwitch
            v-if="kind === 'item'"
            :model-value="isDisplayed(kind, entry.id)"
            :label="isDisplayed(kind, entry.id) ? 'Shown' : 'Hidden'"
            :ui="{ label: 'w-14 text-white' }"
            size="sm"
            class="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-1"
            :aria-label="`Toggle whether this ${title.toLowerCase().replace(/s$/, '')} is displayed`"
            @update:model-value="toggleDisplay(kind, entry.id)"
          />

          <USwitch
            v-else
            :model-value="isLocationActive(entry.id)"
            :label="isLocationActive(entry.id) ? 'Shown' : 'Hidden'"
            :ui="{ label: 'w-14 text-white' }"
            size="sm"
            class="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-1"
            :aria-label="`Toggle whether this ${title.toLowerCase().replace(/s$/, '')} is displayed`"
            @update:model-value="toggleLocationDisplay(entry.id)"
          />

          <UButton
            v-if="kind === 'location'"
            color="neutral"
            variant="subtle"
            icon="i-lucide-cloud-fog"
            size="xs"
            class="absolute left-1 top-9"
            @click="displayTarget = entry"
          >
            Edit fog
          </UButton>

          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="solid"
            size="xs"
            class="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
            :aria-label="`Delete ${title.toLowerCase()} image`"
            @click="deleteTarget = entry"
          />

          <UButton
            v-if="kind === 'item'"
            icon="i-lucide-pencil"
            color="neutral"
            variant="solid"
            size="xs"
            class="absolute right-1 top-9 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Edit item name"
            @click="openRename(entry)"
          />

          <div
            v-if="kind === 'item' && entry.name"
            class="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 pr-8 text-center text-xs text-white"
          >
            {{ entry.name }}
          </div>

          <div
            class="drag-handle absolute bottom-1 right-1 cursor-grab rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            :aria-label="`Drag to reorder ${title.toLowerCase()}`"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="size-4"
            />
          </div>
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

    <UModal
      :open="nameModalOpen"
      :title="renameTargetId ? 'Edit item name' : 'Name this item'"
      @update:open="value => { if (!value) closeNameModal() }"
    >
      <template #body>
        <UFormField label="Name">
          <UInput
            v-model="nameInput"
            class="w-full"
            placeholder="Item name"
            autofocus
            @keyup.enter="confirmName"
          />
        </UFormField>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            @click="closeNameModal"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            @click="confirmName"
          >
            {{ renameTargetId ? 'Save' : 'Add item' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <LocationDisplayModal
      v-if="kind === 'location'"
      :location="displayTarget"
      @close="displayTarget = null"
    />
  </section>
</template>

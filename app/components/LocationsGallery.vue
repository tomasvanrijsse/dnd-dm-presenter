<script setup lang="ts">
import type { GalleryImage } from '~/types/cast'

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)
const { addLocation, removeLocation, reorderLocations } = locationsStore

const locationDisplayStore = useLocationDisplayStore()
const { isActive: isLocationActive, showLocation, hideLocation } = locationDisplayStore

function toggleLocationDisplay(id: string): void {
  if (isLocationActive(id)) {
    hideLocation()
  } else {
    showLocation(id)
  }
}

const fileInput = ref<HTMLInputElement | null>(null)

async function onFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    addLocation(await convertImageFileToWebp(file))
  }

  input.value = ''
}

const displayTarget = ref<GalleryImage | null>(null)
</script>

<template>
  <GalleryGrid
    title="Locations"
    kind="location"
    :images="locations"
    @remove="removeLocation"
    @reorder="reorderLocations"
  >
    <template #add-button>
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="subtle"
        @click="fileInput?.click()"
      >
        Add location
      </UButton>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      >
    </template>

    <template #overlay="{ entry }">
      <USwitch
        :model-value="isLocationActive(entry.id)"
        :label="isLocationActive(entry.id) ? 'Shown' : 'Hidden'"
        :ui="{ label: 'w-14 text-white' }"
        size="sm"
        class="absolute left-1 top-1 rounded bg-black/50 px-1.5 py-1"
        aria-label="Toggle whether this location is displayed"
        @update:model-value="toggleLocationDisplay(entry.id)"
      />

      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-cloud-fog"
        size="xs"
        class="absolute left-1 top-9"
        @click="displayTarget = entry"
      >
        Edit fog
      </UButton>
    </template>
  </GalleryGrid>

  <LocationDisplayModal
    :location="displayTarget"
    @close="displayTarget = null"
  />
</template>
